package com.proyectogobuss.Entities;

import com.proyectogobuss.Entities.UsersEntities.Usuario;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "reserva_temporal")
@Data
public class ReservaTemporal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idReservaTemporal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asiento", nullable = false)
    private AsientoReservado asientoReservado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_cedula", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime fechaExpiracion;

    @Column(nullable = false)
    private boolean activo = true;
}
