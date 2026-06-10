package com.proyectogobuss.JPAController.UsersJPAControllers;

import com.proyectogobuss.Entities.UsersEntities.Usuario;
import com.proyectogobuss.JPAController.JPAUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;



public class UsuarioJPAController {


    public void create(Usuario u) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(u);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public Usuario buscarPorCedula(String cedula) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.find(Usuario.class, cedula);
        } finally {
            em.close();
        }
    }

    public Usuario buscarPorCorreo(String correo) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<Usuario> q = em.createQuery(
                    "SELECT u FROM Usuario u WHERE u.correo = :correo",
                    Usuario.class);
            q.setParameter("correo", correo);
            return q.getSingleResult();
        } catch (NoResultException e) {
            return null;
        } finally {
            em.close();
        }
    }
    public Usuario login(String cedula, String clave) {
        EntityManager em = JPAUtil.getEntityManager();

        try {
            return em.createQuery(
                    "SELECT u FROM Usuario u WHERE u.cedula = :ced AND u.clave = :clave",
                    Usuario.class
            )
            .setParameter("ced", cedula)
            .setParameter("clave", clave)
            .getSingleResult();

        } catch (NoResultException e) {
            return null;

        } finally {
            em.close();
        }
    }
}

    

