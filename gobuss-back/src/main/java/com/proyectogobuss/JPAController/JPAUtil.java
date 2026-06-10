package com.proyectogobuss.JPAController;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class JPAUtil {

    private static EntityManagerFactory emf;

    public static EntityManager getEntityManager() {
        if (emf == null) {
            emf = Persistence.createEntityManagerFactory("GoBussPU");
        }
        return emf.createEntityManager();
    }
       public static void close() {
        if (emf != null && emf.isOpen()) {
            emf.close();
        }
    }
}
