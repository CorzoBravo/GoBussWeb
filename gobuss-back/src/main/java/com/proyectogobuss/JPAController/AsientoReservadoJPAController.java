package com.proyectogobuss.JPAController;

import com.proyectogobuss.Entities.AsientoReservado;
import com.proyectogobuss.Entities.Boleto;

import jakarta.persistence.EntityManager;


import java.util.List;

public class AsientoReservadoJPAController {


    public List<AsientoReservado> buscarPorHorario(int idHorario) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery("""
                SELECT a FROM AsientoReservado a
                WHERE a.horario.idHorario = :id
            """, AsientoReservado.class)
            .setParameter("id", idHorario)
            .getResultList();
        } finally {
            em.close();
        }
    }

    public void create(AsientoReservado a) {
         EntityManager em = JPAUtil.getEntityManager();
        em.getTransaction().begin();
        em.persist(a);
        em.getTransaction().commit();
        em.close();
    }

    public void asignarBoleto(int idHorario, Boleto boleto) {
          EntityManager em = JPAUtil.getEntityManager();
        em.getTransaction().begin();

        em.createQuery("""
            UPDATE AsientoReservado a
            SET a.boleto = :boleto,
                a.estado = 'OCUPADO'
            WHERE a.horario.idHorario = :id
              AND a.estado = 'RESERVADO'
        """)
        .setParameter("boleto", boleto)
        .setParameter("id", idHorario)
        .executeUpdate();

        em.getTransaction().commit();
        em.close();
    }
    public int contarReservadosPorHorario(int idHorario) {

    EntityManager em = JPAUtil.getEntityManager();

    try {
        Long total = em.createQuery(
                "SELECT COUNT(a) " +
                "FROM AsientoReservado a " +
                "WHERE a.horario.idHorario = :idHorario " +
                "AND a.estado IN ('RESERVADO','OCUPADO')",
                Long.class
        )
        .setParameter("idHorario", idHorario)
        .getSingleResult();

        return total.intValue();

    } finally {
        em.close();
    }
}

}
