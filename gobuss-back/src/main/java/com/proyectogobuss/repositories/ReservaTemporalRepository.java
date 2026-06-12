package com.proyectogobuss.repositories;

import com.proyectogobuss.Entities.ReservaTemporal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaTemporalRepository extends JpaRepository<ReservaTemporal, Integer> {

    List<ReservaTemporal> findByUsuarioCedulaAndActivoTrue(String usuarioCedula);

    Optional<ReservaTemporal> findByAsientoReservadoIdReservaAndActivoTrue(Integer idReserva);

    @Modifying
    @Query("UPDATE ReservaTemporal r SET r.activo = false WHERE r.fechaExpiracion < :now AND r.activo = true")
    int deactivateExpiredReservations(LocalDateTime now);
    
    @Query("SELECT r FROM ReservaTemporal r WHERE r.fechaExpiracion < :now AND r.activo = true")
    List<ReservaTemporal> findExpiredReservations(LocalDateTime now);
}
