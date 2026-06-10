package com.proyectogobuss.JPAController.CoopJPASControllers;

import com.proyectogobuss.Entities.CoopEntities.Conductor;
import com.proyectogobuss.JPAController.JPAUtil;
import com.proyectogobuss.Services.SessionData;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class ConductorJPAController {

    public void create(Conductor c) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(c);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public void edit(Conductor c) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(c);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public void destruir(String cedula) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            Conductor c = em.find(Conductor.class, cedula);
            if (c != null) em.remove(c);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public List<Conductor> listarPorCooperativa(String ruc) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Conductor> query = em.createQuery(
                    "SELECT c FROM Conductor c WHERE c.cooperativa.ruc = :ruc",
                    Conductor.class
            );
            query.setParameter("ruc", SessionData.cooperativa.getRuc());
            return query.getResultList();
        } finally {
            em.close();
        }
    }
}
