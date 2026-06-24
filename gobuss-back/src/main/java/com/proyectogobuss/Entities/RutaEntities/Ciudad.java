package com.proyectogobuss.Entities.RutaEntities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "ciudad")
public class Ciudad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 60)
    private String nombre;



    public Ciudad(String nombre) {
        this.nombre = nombre;
    }

    @Override
    public String toString() {
        return nombre; 
    }

    @Column(nullable = false)
    private boolean activo = true;
}

