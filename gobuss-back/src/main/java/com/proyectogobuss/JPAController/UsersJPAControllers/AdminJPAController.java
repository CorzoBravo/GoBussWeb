package com.proyectogobuss.JPAController.UsersJPAControllers;

import com.proyectogobuss.Entities.UsersEntities.Admin;
import com.proyectogobuss.JPAController.JPAUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;

public class AdminJPAController {

    public Admin login(String id, String clave) {
        EntityManager em = JPAUtil.getEntityManager();

        try {
            return em.createQuery(
                    "SELECT a FROM Admin a WHERE a.id = :id AND a.clave = :clave",
                    Admin.class)
                    .setParameter("id", id)
                    .setParameter("clave", clave)
                    .getSingleResult();

        } catch (NoResultException e) {
            return null;

        } finally {
            em.close();
        }


    }
    public Admin find(String id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.find(Admin.class, id);
        } finally {
            em.close();
        }
    }

}
