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
    private final com.proyectogobuss.repositories.ReservaTemporalRepository reservaRepository;

    private BoletoService self;

    @org.springframework.context.annotation.Autowired
    public void setSelf(@org.springframework.context.annotation.Lazy BoletoService self) {
        this.self = self;
    }

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
            if (asiento.getEstado() != AsientoReservado.EstadoAsiento.RESERVADO) {
                throw new IllegalStateException("El asiento " + asiento.getNumeroAsiento() + " no está reservado. Debe reservarlo antes de pagar.");
            }
            
            // Check that this user holds the reservation
            com.proyectogobuss.Entities.ReservaTemporal reserva = reservaRepository.findByAsientoReservadoIdReservaAndActivoTrue(asiento.getIdReserva())
                .orElseThrow(() -> new IllegalStateException("La reserva para el asiento " + asiento.getNumeroAsiento() + " expiró o no existe."));
            
            if (!reserva.getUsuario().getCedula().equals(usuarioCedula)) {
                throw new SecurityException("El asiento " + asiento.getNumeroAsiento() + " está reservado por otra persona.");
            }

            asiento.setEstado(AsientoReservado.EstadoAsiento.OCUPADO);
            
            // Deactivate reservation
            reserva.setActivo(false);
            reservaRepository.save(reserva);
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
        self.procesarYEnviarBoletoAsync(savedBoleto.getIdBoleto());

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
            procesarYEnviarBoletoInterno(temp);
        } catch (Exception e) {
            log.error("Failed to process async ticket for boleto ID: " + boletoId, e);
        }
    }

    public void procesarYEnviarBoleto(Boleto boleto, String requester, boolean isAdmin) {
        Boleto boletoDB = boletoRepository.findCompleto(boleto.getIdBoleto());
        if (boletoDB == null) {
            throw new ResourceNotFoundException("Boleto no encontrado");
        }
        
        String ownerCedula = boletoDB.getUsuario().getCedula();
        String coopRuc = boletoDB.getHorario().getRutaFinal().getCooperativa().getRuc();
        
        if (!isAdmin && !requester.equals(ownerCedula) && !requester.equals(coopRuc)) {
            throw new com.proyectogobuss.exception.UnauthorizedException("No tienes permiso para procesar este boleto");
        }
        
        procesarYEnviarBoletoInterno(boletoDB);
    }

    private void procesarYEnviarBoletoInterno(Boleto boleto) {
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

    public byte[] descargarPdfBoleto(Integer boletoId, String requester, boolean isAdmin) {
        Boleto boletoDB = boletoRepository.findCompleto(boletoId);
        if (boletoDB == null) {
            throw new ResourceNotFoundException("Boleto no encontrado");
        }
        
        String ownerCedula = boletoDB.getUsuario().getCedula();
        String coopRuc = boletoDB.getHorario().getRutaFinal().getCooperativa().getRuc();
        
        if (!isAdmin && !requester.equals(ownerCedula) && !requester.equals(coopRuc)) {
            throw new com.proyectogobuss.exception.UnauthorizedException("No tienes permiso para descargar este boleto");
        }

        try {
            File qr = qrService.generarQr(boletoDB);
            File pdf = pdfService.generarPdf(boletoDB, qr);
            return java.nio.file.Files.readAllBytes(pdf.toPath());
        } catch (Exception e) {
            log.error("Error generando PDF para boleto id={}", boletoId, e);
            throw new RuntimeException("No se pudo generar el PDF", e);
        }
    }

    @Transactional(readOnly = true)
    public List<BoletoDTO> getBoletosByUsuario(String usuarioCedula) {
        return boletoRepository.findByUsuarioCedula(usuarioCedula).stream().map(boleto -> BoletoDTO.builder()
                .idBoleto(boleto.getIdBoleto())
                .usuarioCedula(boleto.getUsuario().getCedula())
                .usuarioNombre(boleto.getUsuario().getNombres())
                .horarioId(boleto.getHorario().getIdHorario())
                .rutaInfo(boleto.getHorario().getRutaFinal().getRutaGeneral().getOrigen().getNombre() + " - " + boleto.getHorario().getRutaFinal().getRutaGeneral().getDestino().getNombre())
                .fechaViaje(boleto.getFechaViaje())
                .monto(boleto.getMonto())
                .cantidadAsientos(boleto.getCantidadAsientos())
                .asientos(boleto.getAsientos() != null ? boleto.getAsientos().stream().map(AsientoReservado::getIdReserva).toList() : List.of())
                .activo(boleto.isActivo())
                .montoReembolso(boleto.getMontoReembolso())
                .build()).toList();
    }

    @Transactional
    public void cancelarBoleto(Integer boletoId, String usuarioCedula) {
        Boleto boleto = boletoRepository.findById(boletoId)
                .orElseThrow(() -> new ResourceNotFoundException("Boleto no encontrado"));

        if (!boleto.getUsuario().getCedula().equals(usuarioCedula)) {
            throw new SecurityException("No tienes permiso para cancelar este boleto");
        }

        if (!boleto.isActivo()) {
            throw new IllegalStateException("El boleto ya está cancelado");
        }

        java.time.LocalDateTime horaViaje = java.time.LocalDateTime.of(boleto.getHorario().getFecha(), boleto.getHorario().getHoraSalida());
        java.time.LocalDateTime ahora = java.time.LocalDateTime.now();

        if (ahora.isAfter(horaViaje)) {
            throw new IllegalStateException("No se puede cancelar un viaje que ya pasó");
        }

        // Política de cancelación 24h
        long horasRestantes = java.time.Duration.between(ahora, horaViaje).toHours();
        double montoReembolso = 0.0;
        
        if (horasRestantes >= 24) {
            montoReembolso = boleto.getMonto(); // 100% de reembolso simulado
            log.info("Cancelación con >24h. Reembolso total de ${} para boleto {}", montoReembolso, boleto.getIdBoleto());
        } else {
            log.info("Cancelación con <24h. Sin reembolso para boleto {}", boleto.getIdBoleto());
        }

        boleto.setMontoReembolso(montoReembolso);
        boleto.setActivo(false);
        boletoRepository.save(boleto);

        if (boleto.getAsientos() != null) {
            for (AsientoReservado asiento : boleto.getAsientos()) {
                asiento.setEstado(AsientoReservado.EstadoAsiento.DISPONIBLE);
                asiento.setBoleto(null);
                asientoRepository.save(asiento);
            }
        }
    }
}
