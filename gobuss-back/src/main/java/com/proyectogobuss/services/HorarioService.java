package com.proyectogobuss.services;

import com.proyectogobuss.Entities.AsientoReservado;
import com.proyectogobuss.Entities.CoopEntities.Horario;
import com.proyectogobuss.Entities.CoopEntities.Unidad;
import com.proyectogobuss.Entities.RutaEntities.RutaFinal;
import com.proyectogobuss.dto.asiento.AsientoDTO;
import com.proyectogobuss.dto.horario.HorarioCreateRequest;
import com.proyectogobuss.dto.horario.HorarioDTO;
import com.proyectogobuss.exception.ResourceNotFoundException;
import com.proyectogobuss.repositories.AsientoReservadoRepository;
import com.proyectogobuss.repositories.HorarioRepository;
import com.proyectogobuss.repositories.RutaFinalRepository;
import com.proyectogobuss.repositories.UnidadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class HorarioService {

    private final HorarioRepository horarioRepository;
    private final RutaFinalRepository rutaFinalRepository;
    private final UnidadRepository unidadRepository;
    private final AsientoReservadoRepository asientoRepository;
    private final RutaService rutaService;

    @Transactional(readOnly = true)
    public List<HorarioDTO> getByCooperativa(String ruc) {
        List<Horario> horarios = horarioRepository.findByCooperativaRuc(ruc);
        return horarios.stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HorarioDTO> getByRuta(Integer rutaId) {
        List<Horario> horarios = horarioRepository.findByRutaFinalIdRutaFinal(rutaId);
        return horarios.stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public HorarioDTO getById(Integer id) {
        Horario horario = horarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Horario not found: " + id));
        return convertToDTO(horario);
    }

    public HorarioDTO create(String ruc, HorarioCreateRequest request) {
        // Validar existencia de RutaFinal y Unidad
        RutaFinal ruta = rutaFinalRepository.findById(request.getRutaFinalId())
                .orElseThrow(() -> new ResourceNotFoundException("Ruta final not found"));

        if (!ruta.getCooperativa().getRuc().equals(ruc)) {
            throw new ResourceNotFoundException("Ruta does not belong to this cooperativa");
        }

        Unidad unidad = unidadRepository.findById(request.getUnidadId())
                .orElseThrow(() -> new ResourceNotFoundException("Unidad not found"));

        if (!unidad.getRuc().equals(ruc)) {
            throw new ResourceNotFoundException("Unidad does not belong to this cooperativa");
        }

        // Crear Horario
        Horario horario = new Horario();
        horario.setRutaFinal(ruta);
        horario.setUnidad(unidad);
        horario.setFecha(request.getFecha());
        horario.setHoraSalida(request.getHoraSalida());
        horario.setActivo(true);

        horario = horarioRepository.save(horario);
        log.info("Horario created: {}", horario.getIdHorario());

        // Generar AsientosReservados
        generateAsientos(horario, unidad.getCapacidad());

        return convertToDTO(horario);
    }

    private void generateAsientos(Horario horario, Integer capacidad) {
        for (int i = 1; i <= capacidad; i++) {
            AsientoReservado asiento = new AsientoReservado();
            asiento.setHorario(horario);
            asiento.setNumeroAsiento(i);
            asiento.setEstado(AsientoReservado.EstadoAsiento.DISPONIBLE);
            asientoRepository.save(asiento);
        }
        log.info("Generated {} asientos for horario {}", capacidad, horario.getIdHorario());
    }

    public HorarioDTO toggleStatus(String ruc, Integer id) {
        Horario horario = horarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Horario not found: " + id));

        if (!horario.getRutaFinal().getCooperativa().getRuc().equals(ruc)) {
            throw new ResourceNotFoundException("Horario does not belong to this cooperativa");
        }

        horario.setActivo(!horario.isActivo());
        horario = horarioRepository.save(horario);
        log.info("Horario status toggled: {} -> {}", id, horario.isActivo());

        return convertToDTO(horario);
    }

    @Transactional(readOnly = true)
    public List<AsientoDTO> getAsientos(Integer horarioId) {
        List<AsientoReservado> asientos = asientoRepository.findByHorarioIdHorario(horarioId);
        return asientos.stream()
                .map(a -> AsientoDTO.builder()
                        .idReserva(a.getIdReserva())
                        .numeroAsiento(a.getNumeroAsiento())
                        .estado(a.getEstado().name())
                        .numeroBoleto(a.getBoleto() != null ? a.getBoleto().getIdBoleto() : null)
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public Integer getAvailableSeats(Integer horarioId) {
        Horario horario = horarioRepository.findById(horarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Horario not found"));

        long reserved = asientoRepository.countByHorarioIdHorarioAndEstado(horarioId, AsientoReservado.EstadoAsiento.RESERVADO);
        long occupied = asientoRepository.countByHorarioIdHorarioAndEstado(horarioId, AsientoReservado.EstadoAsiento.OCUPADO);

        return horario.getUnidad().getCapacidad() - (int)(reserved + occupied);
    }

    @Transactional(readOnly = true)
    public List<HorarioDTO> searchAvailable(LocalDate fecha, Integer origenId, Integer destinoId) {
        // Buscar todas las rutas entre origen y destino
        List<RutaFinal> rutas = rutaFinalRepository.findByRutaGeneralIdRutaGeneral(0)
                .stream()
                .filter(r -> r.getRutaGeneral().getOrigen().getId().equals(origenId)
                        && r.getRutaGeneral().getDestino().getId().equals(destinoId))
                .toList();

        // Buscar horarios para esa fecha con esos horarios
        return rutas.stream()
                .flatMap(ruta -> horarioRepository.findByFechaAndRutaFinalIdRutaFinal(fecha, ruta.getIdRutaFinal()).stream())
                .filter(h -> h.isActivo() && getAvailableSeats(h.getIdHorario()) > 0)
                .map(this::convertToDTO)
                .toList();
    }

    private HorarioDTO convertToDTO(Horario horario) {
        int available = getAvailableSeats(horario.getIdHorario());
        int reserved = (int) asientoRepository.countByHorarioIdHorarioAndEstado(horario.getIdHorario(), AsientoReservado.EstadoAsiento.RESERVADO);

        return HorarioDTO.builder()
                .idHorario(horario.getIdHorario())
                .fecha(horario.getFecha())
                .horaSalida(horario.getHoraSalida())
                .activo(horario.isActivo())
                .asientosDisponibles(available)
                .asientosReservados(reserved)
                .build();
    }
}
