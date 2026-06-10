package com.proyectogobuss.Entities.CoopEntities;

import java.time.LocalDate;

import com.proyectogobuss.Entities.RutaEntities.RutaFinal;

import jakarta.persistence.*;

@Entity
@Table(name = "horarioruta")
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idHorario;

    @ManyToOne
    @JoinColumn(name = "id_unidad", nullable = false)
    private Unidad unidad;

    @ManyToOne
    @JoinColumn(name = "idRutaFinal", nullable = false)
    private RutaFinal rutaFinal;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "hora_salida", nullable = false)
    private String horaSalida;

    @Column(nullable = false)
    private boolean activo = true;

    public int getIdHorario() {
        return idHorario;
    }

    public void setIdHorario(int idHorario) {
        this.idHorario = idHorario;
    }

    public Unidad getUnidad() {
        return unidad;
    }

    public void setUnidad(Unidad unidad) {
        this.unidad = unidad;
    }

    public RutaFinal getRutaFinal() {
        return rutaFinal;
    }

    public void setRutaFinal(RutaFinal rutaFinal) {
        this.rutaFinal = rutaFinal;
    }

    public LocalDate getFecha() {
        return fecha;
    }
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getHoraSalida() {
        return horaSalida;
    }

    public void setHoraSalida(String horaSalida) {
        this.horaSalida = horaSalida;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
}