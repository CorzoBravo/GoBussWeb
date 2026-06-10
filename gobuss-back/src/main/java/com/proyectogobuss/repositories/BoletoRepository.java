package com.proyectogobuss.repositories;

import com.proyectogobuss.Entities.Boleto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BoletoRepository extends JpaRepository<Boleto, Integer> {

    List<Boleto> findByUsuarioCedula(String cedula);

    List<Boleto> findByFechaViajeGreaterThanEqual(LocalDate fecha);

    List<Boleto> findByFechaViajeBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT b FROM Boleto b WHERE b.horario.rutaFinal.cooperativa.ruc = :ruc " +
           "AND b.fechaViaje BETWEEN :startDate AND :endDate")
    List<Boleto> findByCooperativaAndDateRange(@Param("ruc") String ruc,
                                               @Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate);

    long countByFechaViajeAndHorarioIdHorario(LocalDate fecha, int idHorario);

    @Query("""
        SELECT new com.proyectogobuss.dto.ReporteVentasRutaDTO(
            CONCAT(o.nombre, ' - ', d.nombre),
            COUNT(b.idBoleto),
            SUM(b.monto)
        )
        FROM Boleto b
        JOIN b.horario h
        JOIN h.rutaFinal rf
        JOIN rf.cooperativa c
        JOIN rf.rutaGeneral rg
        JOIN rg.origen o
        JOIN rg.destino d
        WHERE c.ruc = :ruc
        GROUP BY o.nombre, d.nombre
        ORDER BY SUM(b.monto) DESC
    """)
    List<com.proyectogobuss.dto.ReporteVentasRutaDTO> reporteVentasPorRuta(@Param("ruc") String ruc);

    @Query("""
        SELECT new com.proyectogobuss.dto.ReporteVentasFechaDTO(
            CAST(b.fechaCompra AS LocalDate),
            COUNT(b),
            SUM(b.monto)
        )
        FROM Boleto b
        JOIN b.horario h
        JOIN h.rutaFinal rf
        JOIN rf.cooperativa c
        WHERE c.ruc = :ruc
          AND CAST(b.fechaCompra AS LocalDate) BETWEEN :inicio AND :fin
        GROUP BY CAST(b.fechaCompra AS LocalDate)
    """)
    List<com.proyectogobuss.dto.ReporteVentasFechaDTO> ventasPorFecha(
            @Param("ruc") String ruc,
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin);

    @Query("""
        SELECT b FROM Boleto b 
        JOIN FETCH b.horario h 
        JOIN FETCH h.rutaFinal rf 
        JOIN FETCH rf.rutaGeneral rg 
        JOIN FETCH rg.origen 
        JOIN FETCH rg.destino 
        JOIN FETCH rf.cooperativa 
        LEFT JOIN FETCH b.asientos 
        LEFT JOIN FETCH b.usuario 
        WHERE b.idBoleto = :id
    """)
    Boleto findCompleto(@Param("id") Integer id);
}
