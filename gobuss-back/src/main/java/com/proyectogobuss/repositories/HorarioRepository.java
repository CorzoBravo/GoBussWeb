package com.proyectogobuss.repositories;

import com.proyectogobuss.Entities.CoopEntities.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Integer> {

    List<Horario> findByRutaFinalIdRutaFinal(Integer idRutaFinal);

    List<Horario> findByFechaAndRutaFinalIdRutaFinal(LocalDate fecha, Integer idRutaFinal);

    @Query("SELECT h FROM Horario h WHERE h.rutaFinal.cooperativa.ruc = :ruc AND h.activo = true")
    List<Horario> findActiveByCooperativaRuc(@Param("ruc") String ruc);

    @Query("SELECT h FROM Horario h WHERE h.rutaFinal.cooperativa.ruc = :ruc")
    List<Horario> findByCooperativaRuc(@Param("ruc") String ruc);

    List<Horario> findByUnidadIdUnidad(Integer idUnidad);

    List<Horario> findByActivoTrue();

    @Query("""
        SELECT new com.proyectogobuss.dto.ReporteOcupacionHorarioDTO(
            CONCAT(rg.origen.nombre, ' - ', rg.destino.nombre),
            CAST(h.fecha AS LocalDate),
            h.horaSalida,
            u.placa,
            COUNT(a),
            u.capacidad
        )
        FROM Horario h
        JOIN h.rutaFinal rf
        JOIN rf.rutaGeneral rg
        JOIN rf.cooperativa c
        JOIN h.unidad u
        LEFT JOIN AsientoReservado a
            ON a.horario = h
           AND a.estado = 'RESERVADO'
        WHERE c.ruc = :ruc
          AND CAST(h.fecha AS LocalDate) BETWEEN :inicio AND :fin
        GROUP BY h.idHorario
        ORDER BY h.fecha, h.horaSalida
    """)
    List<com.proyectogobuss.dto.ReporteOcupacionHorarioDTO> ocupacionPorHorario(
            @Param("ruc") String ruc,
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin);
}
