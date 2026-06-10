package com.proyectogobuss.JPAController.CoopJPASControllers;

import com.proyectogobuss.Entities.CoopEntities.Unidad;
import com.proyectogobuss.JPAController.JPAUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.util.List;

public class UnidadJPAController {

    public List<Unidad> findByCooperativa(String ruc) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Unidad> q = em.createQuery(
                    "SELECT u FROM Unidad u WHERE u.ruc = :ruc", Unidad.class);
            q.setParameter("ruc", ruc);
            return q.getResultList();
        } finally {
            em.close();
        }
    }

    public boolean create(Unidad u) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(u);
            em.getTransaction().commit();
            return true;
        } catch (Exception ex) {
            em.getTransaction().rollback();
            ex.printStackTrace();
            return false;
        } finally {
            em.close();
        }
    }

    public boolean update(Unidad u) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(u);
            em.getTransaction().commit();
            return true;
        } catch (Exception ex) {
            em.getTransaction().rollback();
            ex.printStackTrace();
            return false;
        } finally {
            em.close();
        }
    }

    public void edit(Unidad u) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(u);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public void destroy(int idUnidad) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            Unidad u = em.find(Unidad.class, idUnidad);
            if (u != null)
                em.remove(u);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }
}
