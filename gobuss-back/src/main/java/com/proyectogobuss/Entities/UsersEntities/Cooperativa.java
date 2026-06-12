package com.proyectogobuss.Entities.UsersEntities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cooperativas", indexes = {
    @Index(name = "idx_coop_ruc", columnList = "ruc"),
    @Index(name = "idx_coop_activo", columnList = "activo")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "ruc")
public class Cooperativa {

    @Id
    @Column(length = 20)
    private String ruc;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String direccion;

    @Column(length = 100)
    private String correo;

    @Column(length = 20)
    private String telefono;

    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;

    public enum EstadoCooperativa {
        PENDIENTE,
        APROBADA,
        RECHAZADA
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EstadoCooperativa estado = EstadoCooperativa.PENDIENTE;
}
