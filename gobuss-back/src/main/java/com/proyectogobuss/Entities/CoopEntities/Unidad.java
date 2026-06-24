package com.proyectogobuss.Entities.CoopEntities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "unidad")
public class Unidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idUnidad")
    private int idUnidad;

    @Column(name = "ruc", nullable = false)
    private String ruc;

    @Column(name = "numero", nullable = false)
    private int numero;

    @Column(name = "placa")
    private String placa;

    @Column(name = "fabricado")
    private String fabricado;

    @Column(name = "modelo")
    private String modelo;

    @Column(name = "capacidad")
    private int capacidad;

    @Override
    public String toString() {
        return "Unidad " + numero + " â€¢ Placa: " + placa;
    }

    @Column(nullable = false)
    private boolean activo = true;
}

