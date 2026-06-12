package com.proyectogobuss.services;

import com.proyectogobuss.Entities.AsientoReservado;
import com.proyectogobuss.Entities.Boleto;
import com.proyectogobuss.Entities.CoopEntities.Horario;
import com.proyectogobuss.Entities.UsersEntities.Usuario;
import com.proyectogobuss.dto.boleto.BoletoCreateRequest;
import com.proyectogobuss.dto.boleto.BoletoDTO;
import com.proyectogobuss.exception.ResourceNotFoundException;
import com.proyectogobuss.repositories.AsientoReservadoRepository;
import com.proyectogobuss.repositories.BoletoRepository;
import com.proyectogobuss.repositories.HorarioRepository;
import com.proyectogobuss.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BoletoService {

    private final QRService qrService;
    private final PDFService pdfService;
    private final EmailServiceBrevo emailService;
    private final BoletoRepository boletoRepository;
    private final HorarioRepository horarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final AsientoReservadoRepository asientoRepository;

    @Transactional
    public BoletoDTO crearBoleto(BoletoCreateRequest request, String usuarioCedula) {
        Horario horario = horarioRepository.findById(request.getHorarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Horario no encontrado"));

        Usuario usuario = usuarioRepository.findById(usuarioCedula)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        List<AsientoReservado> asientos = asientoRepository.findAllById(request.getAsientos());
        
        if (asientos.size() != request.getAsientos().size()) {
            throw new IllegalArgumentException("Algunos asientos no son válidos");
        }

        for (AsientoReservado asiento : asientos) {
            if (asiento.getHorario().getIdHorario() != horario.getIdHorario()) {
                throw new IllegalArgumentException("El asiento " + asiento.getNumeroAsiento() + " no pertenece a este horario");
            }
            if (asiento.getEstado() != AsientoReservado.EstadoAsiento.DISPONIBLE) {
                throw new IllegalStateException("El asiento " + asiento.getNumeroAsiento() + " no está disponible");
            }
            asiento.setEstado(AsientoReservado.EstadoAsiento.OCUPADO);
        }

        Double precioUnitario = horario.getRutaFinal().getPrecio();
        Double montoTotal = precioUnitario * asientos.size();

        Boleto boleto = new Boleto();
        boleto.setUsuario(usuario);
        boleto.setHorario(horario);
        boleto.setFechaViaje(horario.getFecha());
        // fechaCompra is handled by DB defaults usually or we set it explicitly. 
        // We will just let DB insert it or the entity default it.
        boleto.setMonto(montoTotal);
        boleto.setCantidadAsientos(asientos.size());
        
        Boleto savedBoleto = boletoRepository.save(boleto);

        for (AsientoReservado asiento : asientos) {
            asiento.setBoleto(savedBoleto);
            asientoRepository.save(asiento);
        }
        
        // Trigger async processing
        procesarYEnviarBoletoAsync(savedBoleto.getIdBoleto());

        return BoletoDTO.builder()
                .idBoleto(savedBoleto.getIdBoleto())
                .usuarioCedula(usuario.getCedula())
                .usuarioNombre(usuario.getNombres())
                .horarioId(horario.getIdHorario())
                .rutaInfo(horario.getRutaFinal().getRutaGeneral().getOrigen().getNombre() + " - " + horario.getRutaFinal().getRutaGeneral().getDestino().getNombre())
                .fechaViaje(savedBoleto.getFechaViaje())
                .monto(savedBoleto.getMonto())
                .cantidadAsientos(savedBoleto.getCantidadAsientos())
                .asientos(request.getAsientos())
                .build();
    }

    @Async
    public void procesarYEnviarBoletoAsync(Integer boletoId) {
        try {
            Boleto temp = new Boleto();
            temp.setIdBoleto(boletoId);
            procesarYEnviarBoleto(temp);
        } catch (Exception e) {
            log.error("Failed to process async ticket for boleto ID: " + boletoId, e);
        }
    }

    public void procesarYEnviarBoleto(Boleto boleto) {
        try {
            Boleto boletoDB = boletoRepository.findCompleto(boleto.getIdBoleto());
            File qr = qrService.generarQr(boletoDB);
            File pdf = pdfService.generarPdf(boletoDB, qr);
            emailService.enviarBoleto(boletoDB, pdf);
        } catch (Exception e) {
            log.error("Error procesando boleto id={}", boleto.getIdBoleto(), e);
            throw new RuntimeException("No se pudo procesar y enviar el boleto", e);
        }
    }
}
