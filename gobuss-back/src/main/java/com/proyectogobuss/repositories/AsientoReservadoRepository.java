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
}
