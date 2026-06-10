package com.proyectogobuss.Entities.CoopEntities;

import jakarta.persistence.*;

@Entity
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

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    public Conductor getConductorAsignado() {
        return conductorAsignado;
    }

    public void setConductorAsignado(Conductor conductorAsignado) {
        this.conductorAsignado = conductorAsignado;
    }
}
