package com.proyectogobuss.JPAController.CoopJPASControllers;

import com.proyectogobuss.Entities.CoopEntities.Ayudante;
import com.proyectogobuss.JPAController.JPAUtil;

import jakarta.persistence.*;

import java.util.List;

public class AyudanteJPAController {

    public void create(Ayudante a) {
        EntityManager em = JPAUtil.getEntityManager();
        em.getTransaction().begin();
        em.persist(a);
        em.getTransaction().commit();
        em.close();
    }

    public void edit(Ayudante a) {
        EntityManager em = JPAUtil.getEntityManager();
        em.getTransaction().begin();
        em.merge(a);
        em.getTransaction().commit();
        em.close();
    }

    public void delete(String cedula) {
        EntityManager em = JPAUtil.getEntityManager();
        em.getTransaction().begin();
        Ayudante a = em.find(Ayudante.class, cedula);
        if (a != null)
            em.remove(a);
        em.getTransaction().commit();
        em.close();
    }

    public List<Ayudante> listarPorCooperativa(String ruc) {
        EntityManager em = JPAUtil.getEntityManager();
        List<Ayudante> lista = em.createQuery(
                """
                        SELECT a FROM Ayudante a
                        LEFT JOIN a.conductorAsignado c
                        WHERE c.cooperativa.ruc = :ruc OR a.conductorAsignado IS NULL
                        """,
                Ayudante.class).setParameter("ruc", ruc)
                .getResultList();
        em.close();
        return lista;
    }
}
