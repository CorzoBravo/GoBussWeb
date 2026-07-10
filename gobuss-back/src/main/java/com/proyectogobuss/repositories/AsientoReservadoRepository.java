package com.proyectogobuss.repositories;

import com.proyectogobuss.Entities.AsientoReservado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AsientoReservadoRepository extends JpaRepository<AsientoReservado, Integer> {

    List<AsientoReservado> findByHorarioIdHorario(Integer idHorario);

    Optional<AsientoReservado> findByHorarioIdHorarioAndNumeroAsiento(Integer idHorario, Integer numeroAsiento);

    List<AsientoReservado> findByBoletoIdBoleto(Integer idBoleto);

    long countByHorarioIdHorarioAndEstado(Integer idHorario, AsientoReservado.EstadoAsiento estado);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select a from AsientoReservado a where a.idReserva in :ids")
    List<AsientoReservado> findAllByIdForUpdate(@org.springframework.data.repository.query.Param("ids") List<Integer> ids);
}
