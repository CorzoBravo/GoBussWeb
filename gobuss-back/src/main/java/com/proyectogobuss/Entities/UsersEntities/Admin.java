package com.proyectogobuss.Entities.UsersEntities;

import jakarta.persistence.*;

@Entity
@Table(name = "admin")
public class Admin {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 255)
    private String clave;



    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }
}
