package com.proyectogobuss.Entities;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.proyectogobuss.Entities.CoopEntities.Horario;
import com.proyectogobuss.Entities.UsersEntities.Usuario;

@Entity
@Table(name = "boleto")
public class Boleto {
    @OneToMany(mappedBy = "boleto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AsientoReservado> asientosAsientoReservados;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idBoleto;

    @ManyToOne
    @JoinColumn(name = "cedula_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "idHorario", nullable = false)
    private Horario horario;

    @Column(name = "fecha_viaje", nullable = false)
    private LocalDate fechaViaje;

    @Column(name = "fecha_compra", insertable = false, updatable = false)
    private LocalDateTime fechaCompra;

    @Column(nullable = false)
    private double monto;

    @Column(name = "cantidad_asientos", nullable = false)
    private int cantidadAsientos;

    @OneToMany(mappedBy = "boleto", cascade = CascadeType.ALL)
    private List<AsientoReservado> asientos;

    public Integer getIdBoleto() {
        return idBoleto;
    }

    public void setIdBoleto(Integer idBoleto) {
        this.idBoleto = idBoleto;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Horario getHorario() {
        return horario;
    }

    public void setHorario(Horario horario) {
        this.horario = horario;
    }

    public LocalDate getFechaViaje() {
        return fechaViaje;
    }

    public void setFechaViaje(LocalDate fechaViaje) {
        this.fechaViaje = fechaViaje;
    }

    public LocalDateTime getFechaCompra() {
        return fechaCompra;
    }

    public double getMonto() {
        return monto;
    }

    public void setMonto(double monto) {
        this.monto = monto;
    }

    public int getCantidadAsientos() {
        return cantidadAsientos;
    }

    public void setCantidadAsientos(int cantidadAsientos) {
        this.cantidadAsientos = cantidadAsientos;
    }

    public List<AsientoReservado> getAsientos() {
        return asientos;
    }

    public void setAsientos(List<AsientoReservado> asientos) {
        this.asientos = asientos;
    }

    @Column(nullable = false)
    private boolean activo = true;
}