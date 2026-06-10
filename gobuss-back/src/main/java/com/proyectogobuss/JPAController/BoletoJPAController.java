package com.proyectogobuss.JPAController;

import com.proyectogobuss.dto.ReporteOcupacionHorarioDTO;
import com.proyectogobuss.dto.ReporteVentasFechaDTO;
import com.proyectogobuss.dto.ReporteVentasRutaDTO;
import com.proyectogobuss.Entities.Boleto;
import jakarta.persistence.EntityManager;

import java.time.LocalDate;
import java.util.List;

public class BoletoJPAController {

    public void create(Boleto boleto) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(boleto);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public Boleto find(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.find(Boleto.class, id);
        } finally {
            em.close();
        }
    }

    public List<Boleto> findByUsuario(String cedula) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    "SELECT b FROM Boleto b WHERE b.usuario.cedula = :cedula",
                    Boleto.class).setParameter("cedula", cedula)
                    .getResultList();
        } finally {
            em.close();
        }
    }

    public Boleto findCompleto(Integer id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    """
                            SELECT b FROM Boleto b
                            JOIN FETCH b.asientos a
                            JOIN FETCH b.horario h
                            JOIN FETCH h.rutaFinal rf
                            JOIN FETCH rf.rutaGeneral rg
                            JOIN FETCH rg.origen
                            JOIN FETCH rg.destino
                            WHERE b.idBoleto = :id
                            """,
                    Boleto.class).setParameter("id", id)
                    .getSingleResult();
        } finally {
            em.close();
        }
    }

    public List<ReporteVentasRutaDTO> reporteVentasPorRuta(String ruc) {

        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery(
                    """
                            SELECT new com.proyectogobuss.dto.ReporteVentasRutaDTO(
                                CONCAT(o.nombre, ' → ', d.nombre),
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
                            """,
                    ReporteVentasRutaDTO.class).setParameter("ruc", ruc)
                    .getResultList();

        } finally {
            em.close();
        }
    }

    public List<ReporteVentasFechaDTO> ventasPorFecha(
            String ruc,
            LocalDate inicio,
            LocalDate fin) {

        EntityManager em = JPAUtil.getEntityManager();

        try {
            return em.createQuery("""
                        SELECT new com.proyectogobuss.dto.ReporteVentasFechaDTO(
                            FUNCTION('DATE', b.fechaCompra),
                            COUNT(b),
                            SUM(b.monto)
                        )
                        FROM Boleto b
                        JOIN b.horario h
                        JOIN h.rutaFinal rf
                        JOIN rf.cooperativa c
                        WHERE c.ruc = :ruc
                          AND FUNCTION('DATE', b.fechaCompra) BETWEEN :inicio AND :fin
                        GROUP BY FUNCTION('DATE', b.fechaCompra)
                        ORDER BY FUNCTION('DATE', b.fechaCompra)
                    """, ReporteVentasFechaDTO.class)
                    .setParameter("ruc", ruc)
                    .setParameter("inicio", inicio)
                    .setParameter("fin", fin)
                    .getResultList();

        } finally {
            em.close();
        }
    }

    public List<ReporteOcupacionHorarioDTO> ocupacionPorHorario(
            String ruc,
            LocalDate inicio,
            LocalDate fin) {

        EntityManager em = JPAUtil.getEntityManager();

        try {
            return em.createQuery("""
                        SELECT new com.proyectogobuss.dto.ReporteOcupacionHorarioDTO(
                            CONCAT(
                                rg.origen.nombre, ' → ', rg.destino.nombre
                            ),
                            FUNCTION('DATE', h.fecha),
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
                          AND h.fecha BETWEEN :inicio AND :fin
                        GROUP BY h.idHorario
                        ORDER BY h.fecha, h.horaSalida
                    """, ReporteOcupacionHorarioDTO.class)
                    .setParameter("ruc", ruc)
                    .setParameter("inicio", inicio)
                    .setParameter("fin", fin)
                    .getResultList();

        } finally {
            em.close();
        }
    }

}
