package com.proyectogobuss.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.proyectogobuss.Entities.CoopEntities.Horario;
import com.proyectogobuss.Entities.UsersEntities.Usuario;

@Entity
@Table(name = "boleto")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "idBoleto")
public class Boleto {
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

    @OneToMany(mappedBy = "boleto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AsientoReservado> asientos;

    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;
}