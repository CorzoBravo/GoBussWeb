package com.proyectogobuss.JPAController.JPARutaController;

import java.util.List;

import com.proyectogobuss.Entities.RutaEntities.Ciudad;
import com.proyectogobuss.JPAController.JPAUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

public class CiudadJPAController {

    public void create(Ciudad c) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(c);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public List<Ciudad> findAll() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery("SELECT c FROM Ciudad c ORDER BY c.nombre", Ciudad.class)
                     .getResultList();
        } finally {
            em.close();
        }
    }

    public List<Ciudad> findByNombreLike(String filtro) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Ciudad> q = em.createQuery(
                "SELECT c FROM Ciudad c WHERE LOWER(c.nombre) LIKE :filtro ORDER BY c.nombre",
                Ciudad.class);
            q.setParameter("filtro", "%" + filtro.toLowerCase() + "%");
            return q.getResultList();
        } finally {
            em.close();
        }
    }

    public Ciudad findOrCreateByNombre(String nombre) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Ciudad> q = em.createQuery(
                "SELECT c FROM Ciudad c WHERE LOWER(c.nombre) = :nombre",
                Ciudad.class);
            q.setParameter("nombre", nombre.toLowerCase());
            List<Ciudad> list = q.getResultList();
            if (!list.isEmpty()) {
                return list.get(0);
            }

            em.getTransaction().begin();
            Ciudad nueva = new Ciudad(nombre);
            em.persist(nueva);
            em.getTransaction().commit();
            return nueva;
        } finally {
            em.close();
        }
    }
    
}
