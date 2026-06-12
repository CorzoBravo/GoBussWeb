package com.proyectogobuss.Entities.CoopEntities;

import java.time.LocalDate;
import java.time.LocalTime;

import com.proyectogobuss.Entities.RutaEntities.RutaFinal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "horarioruta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "idHorario")
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
    private LocalTime horaSalida;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conductor_cedula", nullable = true)
    private Conductor conductor;

    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;
}