package com.proyectogobuss.Entities.CoopEntities;

import com.proyectogobuss.Entities.RutaEntities.RutaFinal;
import com.proyectogobuss.Entities.UsersEntities.Cooperativa;

import jakarta.persistence.*;

@Entity
@Table(name = "conductor")
public class Conductor {

    @Id
    private String cedula;

    private String nombre;

    private String celular;

    @ManyToOne
    @JoinColumn(name = "ruta_asignada", referencedColumnName = "idRutaFinal", nullable = true)
    private RutaFinal rutaAsignada;

    @ManyToOne
    @JoinColumn(name = "ruc_cooperativa", referencedColumnName = "ruc", nullable = false)
    private Cooperativa cooperativa;

    @ManyToOne
    @JoinColumn(name = "unidad_asignada", referencedColumnName = "idUnidad", nullable = true)
    private Unidad unidadAsignada;

    public Conductor() {
    }

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    public RutaFinal getRutaAsignada() {
        return rutaAsignada;
    }

    public void setRutaAsignada(RutaFinal rutaAsignada) {
        this.rutaAsignada = rutaAsignada;
    }

    public Cooperativa getCooperativa() {
        return cooperativa;
    }

    public void setCooperativa(Cooperativa cooperativa) {
        this.cooperativa = cooperativa;
    }

    public Unidad getUnidadAsignada() {
        return unidadAsignada;
    }

    public void setUnidadAsignada(Unidad unidadAsignada) {
        this.unidadAsignada = unidadAsignada;
    }

    @Override
    public String toString() {
        return nombre + " (" + cedula + ")";
    }

    @Column(nullable = false)
    private boolean activo = true;
}