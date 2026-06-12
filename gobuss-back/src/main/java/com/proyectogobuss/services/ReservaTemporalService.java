package com.proyectogobuss.services;

import com.proyectogobuss.Entities.AsientoReservado;
import com.proyectogobuss.Entities.ReservaTemporal;
import com.proyectogobuss.Entities.UsersEntities.Usuario;
import com.proyectogobuss.repositories.AsientoReservadoRepository;
import com.proyectogobuss.repositories.ReservaTemporalRepository;
import com.proyectogobuss.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservaTemporalService {

    private final ReservaTemporalRepository reservaRepository;
    private final AsientoReservadoRepository asientoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public void reservarAsientos(Integer horarioId, List<Integer> asientosIds, String usuarioCedula) {
        Usuario usuario = usuarioRepository.findById(usuarioCedula)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        List<AsientoReservado> asientos = asientoRepository.findAllById(asientosIds);

        for (AsientoReservado asiento : asientos) {
            if (asiento.getHorario().getIdHorario() != horarioId) {
                throw new IllegalArgumentException("El asiento no pertenece a este horario");
            }
            if (asiento.getEstado() != AsientoReservado.EstadoAsiento.DISPONIBLE) {
                throw new IllegalStateException("El asiento " + asiento.getNumeroAsiento() + " no está disponible");
            }

            asiento.setEstado(AsientoReservado.EstadoAsiento.RESERVADO);
            asientoRepository.save(asiento);

            ReservaTemporal reserva = new ReservaTemporal();
            reserva.setAsientoReservado(asiento);
            reserva.setUsuario(usuario);
            reserva.setFechaExpiracion(LocalDateTime.now().plusMinutes(15));
            reserva.setActivo(true);
            reservaRepository.save(reserva);
        }
    }

    @Transactional
    public void cancelarReserva(Integer asientoId, String usuarioCedula) {
        ReservaTemporal reserva = reservaRepository.findByAsientoReservadoIdReservaAndActivoTrue(asientoId)
                .orElseThrow(() -> new IllegalArgumentException("Reserva activa no encontrada"));

        if (!reserva.getUsuario().getCedula().equals(usuarioCedula)) {
            throw new SecurityException("No tienes permiso para cancelar esta reserva");
        }

        reserva.setActivo(false);
        reservaRepository.save(reserva);

        AsientoReservado asiento = reserva.getAsientoReservado();
        asiento.setEstado(AsientoReservado.EstadoAsiento.DISPONIBLE);
        asientoRepository.save(asiento);
    }

    @Scheduled(fixedRate = 60000) // Every minute
    @Transactional
    public void liberarReservasExpiradas() {
        LocalDateTime now = LocalDateTime.now();
        List<ReservaTemporal> expiradas = reservaRepository.findExpiredReservations(now);
        
        for (ReservaTemporal reserva : expiradas) {
            reserva.setActivo(false);
            reservaRepository.save(reserva);
            
            AsientoReservado asiento = reserva.getAsientoReservado();
            if (asiento.getEstado() == AsientoReservado.EstadoAsiento.RESERVADO) {
                asiento.setEstado(AsientoReservado.EstadoAsiento.DISPONIBLE);
                asientoRepository.save(asiento);
            }
        }
        
        if (!expiradas.isEmpty()) {
            log.info("Liberadas {} reservas temporales expiradas.", expiradas.size());
        }
    }
}
