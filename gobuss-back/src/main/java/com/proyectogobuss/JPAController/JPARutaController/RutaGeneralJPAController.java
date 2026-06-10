package com.proyectogobuss.JPAController.JPARutaController;

import java.util.List;

import com.proyectogobuss.Entities.RutaEntities.Ciudad;
import com.proyectogobuss.Entities.RutaEntities.RutaGeneral;
import com.proyectogobuss.JPAController.JPAUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

public class RutaGeneralJPAController {

    public RutaGeneral create(RutaGeneral r) {
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

    public RutaGeneral findOrCreate(Ciudad origen, Ciudad destino) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            TypedQuery<RutaGeneral> q = em.createQuery(
                "SELECT r FROM RutaGeneral r WHERE r.origen = :origen AND r.destino = :destino",
                RutaGeneral.class);
            q.setParameter("origen", origen);
            q.setParameter("destino", destino);
            List<RutaGeneral> list = q.getResultList();

            if (!list.isEmpty()) {
                return list.get(0);
            }

            em.getTransaction().begin();
            RutaGeneral nueva = new RutaGeneral(origen, destino);
            em.persist(nueva);
            em.getTransaction().commit();
            return nueva;
        } finally {
            em.close();
        }
    }
    public List<RutaGeneral> buscarPorTexto(String texto) {
    EntityManager em = JPAUtil.getEntityManager();
    try {
        return em.createQuery("""
            SELECT r FROM RutaGeneral r
            WHERE LOWER(r.origen.nombre) LIKE :t
               OR LOWER(r.destino.nombre) LIKE :t
        """, RutaGeneral.class)
        .setParameter("t", "%" + texto.toLowerCase() + "%")
        .setMaxResults(10)
        .getResultList();
    } finally {
        em.close();
    }
}

}
