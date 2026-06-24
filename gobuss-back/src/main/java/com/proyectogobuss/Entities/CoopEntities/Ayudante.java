package com.proyectogobuss.Entities.CoopEntities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "ayudante")
public class Ayudante {

    @Id
    @Column(length = 15)
    private String cedula;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(length = 20)
    private String celular;

    @ManyToOne
    @JoinColumn(name = "conductor_asignado", referencedColumnName = "cedula", nullable = true)
    private Conductor conductorAsignado;

    @Column(nullable = false)
    private boolean activo = true;
}

