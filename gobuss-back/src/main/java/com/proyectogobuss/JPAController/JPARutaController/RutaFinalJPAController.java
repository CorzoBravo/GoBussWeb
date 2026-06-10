
package com.proyectogobuss.JPAController.JPARutaController;

import java.util.List;

import com.proyectogobuss.Entities.RutaEntities.RutaFinal;
import com.proyectogobuss.JPAController.JPAUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

public class RutaFinalJPAController {

    public RutaFinal create(RutaFinal r) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(r);
            em.getTransaction().commit();
            return r;
        } finally {
            em.close();
        }
    }

    public List<RutaFinal> findByRuc(String ruc) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<RutaFinal> q = em.createQuery(
                    "SELECT rf FROM RutaFinal rf WHERE rf.cooperativa.ruc = :ruc",
                    RutaFinal.class);
            q.setParameter("ruc", ruc);
            return q.getResultList();
        } finally {
            em.close();
        }
    }

    public void destroy(int idRutaFinal) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            RutaFinal rf = em.find(RutaFinal.class, idRutaFinal);
            if (rf != null) {
                em.getTransaction().begin();
                em.remove(rf);
                em.getTransaction().commit();
            }
        } finally {
            em.close();
        }
    }

    public void edit(RutaFinal rf) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(rf);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

}
