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
    private final com.proyectogobuss.repositories.ReservaTemporalRepository reservaRepository;
    private final com.proyectogobuss.repositories.ConductorRepository conductorRepository;

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<HorarioDTO> getByCooperativa(String ruc, org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.domain.Page<Horario> horarios = horarioRepository.findByCooperativaRuc(ruc, pageable);
        return horarios.map(this::convertToDTO);
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

    public List<HorarioDTO> create(String ruc, HorarioCreateRequest request) {
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

        // Validar conductor
        com.proyectogobuss.Entities.CoopEntities.Conductor conductor = conductorRepository.findById(request.getConductorCedula())
                .orElseThrow(() -> new ResourceNotFoundException("Conductor not found"));

        if (!conductor.getCooperativa().getRuc().equals(ruc)) {
            throw new ResourceNotFoundException("Conductor does not belong to this cooperativa");
        }

        java.util.List<HorarioDTO> results = new java.util.ArrayList<>();
        
        if (Boolean.TRUE.equals(request.getIsRecurrente())) {
            if (request.getFechaFin() == null || request.getDiasSemana() == null || request.getDiasSemana().isEmpty()) {
                throw new IllegalArgumentException("FechaFin y diasSemana son requeridos para recurrencia");
            }
            if (request.getFechaFin().isBefore(request.getFecha())) {
                throw new IllegalArgumentException("FechaFin no puede ser antes de Fecha");
            }
            LocalDate currentDate = request.getFecha();
            while (!currentDate.isAfter(request.getFechaFin())) {
                // DayOfWeek in java.time is 1 (Monday) to 7 (Sunday)
                if (request.getDiasSemana().contains(currentDate.getDayOfWeek().getValue())) {
                    Horario horario = createSingleHorario(ruta, unidad, conductor, currentDate, request.getHoraSalida());
                    results.add(convertToDTO(horario));
                }
                currentDate = currentDate.plusDays(1);
            }
        } else {
            Horario horario = createSingleHorario(ruta, unidad, conductor, request.getFecha(), request.getHoraSalida());
            results.add(convertToDTO(horario));
        }

        return results;
    }

    private Horario createSingleHorario(RutaFinal ruta, Unidad unidad, com.proyectogobuss.Entities.CoopEntities.Conductor conductor, LocalDate fecha, java.time.LocalTime horaSalida) {
        Horario horario = new Horario();
        horario.setRutaFinal(ruta);
        horario.setUnidad(unidad);
        horario.setConductor(conductor);
        horario.setFecha(fecha);
        horario.setHoraSalida(horaSalida);
        horario.setActivo(true);

        horario = horarioRepository.save(horario);
        log.info("Horario created: {}", horario.getIdHorario());

        // Generar AsientosReservados
        generateAsientos(horario, unidad.getCapacidad());
        return horario;
    }

    private void generateAsientos(Horario horario, Integer capacidad) {
        java.util.List<AsientoReservado> asientos = new java.util.ArrayList<>();
        for (int i = 1; i <= capacidad; i++) {
            AsientoReservado asiento = new AsientoReservado();
            asiento.setHorario(horario);
            asiento.setNumeroAsiento(i);
            asiento.setEstado(AsientoReservado.EstadoAsiento.DISPONIBLE);
            asientos.add(asiento);
        }
        asientoRepository.saveAll(asientos);
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
                .map(a -> {
                    Long tiempoRestante = null;
                    if (a.getEstado() == AsientoReservado.EstadoAsiento.RESERVADO) {
                        java.util.Optional<com.proyectogobuss.Entities.ReservaTemporal> reserva = reservaRepository.findByAsientoReservadoIdReservaAndActivoTrue(a.getIdReserva());
                        if (reserva.isPresent()) {
                            java.time.Duration duration = java.time.Duration.between(java.time.LocalDateTime.now(), reserva.get().getFechaExpiracion());
                            tiempoRestante = duration.getSeconds() > 0 ? duration.getSeconds() : 0;
                        }
                    }
                    return AsientoDTO.builder()
                        .idReserva(a.getIdReserva())
                        .numeroAsiento(a.getNumeroAsiento())
                        .estado(a.getEstado().name())
                        .numeroBoleto(a.getBoleto() != null ? a.getBoleto().getIdBoleto() : null)
                        .tiempoRestanteSegundos(tiempoRestante)
                        .build();
                })
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
        List<RutaFinal> rutas = rutaFinalRepository.findAll()
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

    @Transactional(readOnly = true)
    public List<HorarioDTO> getByConductor(String conductorCedula, LocalDate fecha) {
        return horarioRepository.findByConductorCedulaAndFecha(conductorCedula, fecha)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<com.proyectogobuss.dto.horario.PasajeroDTO> getPasajerosByHorario(Integer horarioId) {
        List<AsientoReservado> asientos = asientoRepository.findByHorarioIdHorario(horarioId);
        
        return asientos.stream()
                .filter(a -> a.getEstado() == AsientoReservado.EstadoAsiento.OCUPADO || a.getEstado() == AsientoReservado.EstadoAsiento.RESERVADO)
                .map(a -> {
                    String cedula = "";
                    String nombre = "";
                    String boletoId = "";
                    if (a.getBoleto() != null) {
                        boletoId = String.valueOf(a.getBoleto().getIdBoleto());
                        if (a.getBoleto().getUsuario() != null) {
                            cedula = a.getBoleto().getUsuario().getCedula();
                            nombre = a.getBoleto().getUsuario().getNombres();
                        }
                    }
                    return com.proyectogobuss.dto.horario.PasajeroDTO.builder()
                            .cedula(cedula)
                            .nombre(nombre)
                            .numeroAsiento(a.getNumeroAsiento())
                            .numeroBoleto(boletoId)
                            .estado(a.getEstado().name())
                            .build();
                })
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
                .conductorCedula(horario.getConductor() != null ? horario.getConductor().getCedula() : null)
                .conductorNombre(horario.getConductor() != null ? horario.getConductor().getNombre() : null)
                .rutaFinal(com.proyectogobuss.dto.ruta.RutaFinalDTO.builder()
                    .precio(horario.getRutaFinal().getPrecio())
                    .build())
                .build();
    }
}
