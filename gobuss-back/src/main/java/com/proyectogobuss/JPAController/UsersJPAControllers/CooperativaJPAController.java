package com.proyectogobuss.JPAController.UsersJPAControllers;

import java.util.List;

import com.proyectogobuss.Entities.UsersEntities.Cooperativa;
import com.proyectogobuss.JPAController.JPAUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;

public class CooperativaJPAController {

    public Cooperativa login(String ruc, String clave) {
        EntityManager em = JPAUtil.getEntityManager();

        try {
            return em.createQuery(
                    "SELECT c FROM Cooperativa c WHERE c.ruc = :ruc AND c.clave = :clave",
                    Cooperativa.class)
                    .setParameter("ruc", ruc)
                    .setParameter("clave", clave)
                    .getSingleResult();

        } catch (NoResultException e) {
            return null;

        } finally {
            em.close();
        }
    }

    public List<Cooperativa> findAll() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery("SELECT c FROM Cooperativa c", Cooperativa.class).getResultList();
        } finally {
            em.close();
        }
    }

    public boolean create(Cooperativa coop) {
        EntityManager em = JPAUtil.getEntityManager();

        try {
            em.getTransaction().begin();

            Cooperativa existente = em.find(Cooperativa.class, coop.getRuc());
            if (existente != null) {
                return false;
            }

            em.persist(coop);
            em.getTransaction().commit();
            return true;

        } catch (Exception e) {
            em.getTransaction().rollback();
            e.printStackTrace();
            return false;

        } finally {
            em.close();
        }
    }

    public void destroy(String ruc) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            Cooperativa c = em.find(Cooperativa.class, ruc);
            if (c != null) {
                em.remove(c);
            }
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public boolean update(Cooperativa coop) {
        EntityManager em = JPAUtil.getEntityManager();

        try {
            em.getTransaction().begin();

            Cooperativa existente = em.find(Cooperativa.class, coop.getRuc());
            if (existente == null) {
                return false;
            }

            existente.setNombre(coop.getNombre());
            existente.setDireccion(coop.getDireccion());
            existente.setTelefono(coop.getTelefono());
            existente.setCorreo(coop.getCorreo());
            existente.setClave(coop.getClave());

            em.merge(existente);
            em.getTransaction().commit();

            return true;

        } catch (Exception e) {
            e.printStackTrace();
            em.getTransaction().rollback();
            return false;

        } finally {
            em.close();
        }
    }

    public Cooperativa findByRuc(String ruc) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.find(Cooperativa.class, ruc);
        } finally {
            em.close();
        }
    }

}
