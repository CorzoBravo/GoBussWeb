package com.proyectogobuss.JPAController.CoopJPASControllers;

import java.time.LocalDate;
import java.util.List;

import com.proyectogobuss.Entities.CoopEntities.Horario;
import com.proyectogobuss.JPAController.JPAUtil;

import jakarta.persistence.EntityManager;

public class HorarioJPAController {

    public void create(Horario h) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(h);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public void edit(Horario h) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(h);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public void destroy(int id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            Horario h = em.find(Horario.class, id);
            if (h != null) {
                em.getTransaction().begin();
                h.setActivo(false);
                em.merge(h);
                em.getTransaction().commit();
            }
        } finally {
            em.close();
        }
    }

    public List<Horario> findByRuc(String ruc) {
        EntityManager em = JPAUtil.getEntityManager();

        return em.createQuery(
            "SELECT h FROM Horario h " +
            "WHERE h.activo = true AND h.rutaFinal.cooperativa.ruc = :ruc",
            Horario.class)
            .setParameter("ruc", ruc)
            .getResultList();
    }
    public List<Horario> buscarPorRutaYFecha(int idRutaGeneral, LocalDate fecha) {
    EntityManager em = JPAUtil.getEntityManager();
    try {
        return em.createQuery("""
            SELECT h FROM Horario h
            WHERE h.rutaFinal.rutaGeneral.idRutaGeneral = :idRuta
              AND h.fecha = :fecha
              AND h.activo = true
        """, Horario.class)
        .setParameter("idRuta", idRutaGeneral)
        .setParameter("fecha", fecha)
        .getResultList();
    } finally {
        em.close();
    }
}

}
