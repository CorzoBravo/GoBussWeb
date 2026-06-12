package com.proyectogobuss.Entities;

import com.proyectogobuss.Entities.CoopEntities.Horario;

import jakarta.persistence.*;
@Entity
@Table(name = "asiento_reservado", uniqueConstraints = @UniqueConstraint(columnNames = { "idHorario",
        "numero_asiento" }))
public class AsientoReservado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reserva") 
    private Integer idReserva;

    @Version
    private Integer version;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idHorario")
    private Horario horario;

    @Column(name = "numero_asiento", nullable = false)
    private Integer numeroAsiento;

    @ManyToOne
    @JoinColumn(name = "idBoleto")
    private Boleto boleto;

    
    @Enumerated(EnumType.STRING)
    private EstadoAsiento estado = EstadoAsiento.DISPONIBLE;

    public enum EstadoAsiento {
        DISPONIBLE, RESERVADO, OCUPADO
    }

   
    public Integer getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Integer idReserva) {
        this.idReserva = idReserva;
    }

    public Horario getHorario() {
        return horario;
    }

    public void setHorario(Horario horario) {
        this.horario = horario;
    }

    public Boleto getBoleto() {
        return boleto;
    }

    public void setBoleto(Boleto boleto) {
        this.boleto = boleto;
    }

    public int getNumeroAsiento() {
        return numeroAsiento;
    }

    public void setNumeroAsiento(int numeroAsiento) {
        this.numeroAsiento = numeroAsiento;
    }

    public EstadoAsiento getEstado() {
        return estado;
    }

    public void setEstado(EstadoAsiento estado) {
        this.estado = estado;
    }


    @Column(nullable = false)
    private boolean activo = true;
}