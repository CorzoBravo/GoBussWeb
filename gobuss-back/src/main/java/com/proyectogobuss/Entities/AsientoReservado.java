package com.proyectogobuss.Entities;

import com.proyectogobuss.Entities.CoopEntities.Horario;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
@Entity
@Getter
@Setter
@NoArgsConstructor
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

    @Column(nullable = false)
    private boolean activo = true;
}

