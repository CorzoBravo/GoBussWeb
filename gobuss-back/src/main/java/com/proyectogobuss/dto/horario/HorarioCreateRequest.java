package com.proyectogobuss.dto.horario;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HorarioCreateRequest {

    @NotNull(message = "Ruta final ID is required")
    private Integer rutaFinalId;

    @NotNull(message = "Unidad ID is required")
    private Integer unidadId;

    @NotNull(message = "Fecha is required")
    private LocalDate fecha;

    @NotNull(message = "Hora salida is required")
    private LocalTime horaSalida;

    @NotNull(message = "Conductor is required")
    private String conductorCedula;

    private Boolean isRecurrente;

    private java.util.List<Integer> diasSemana;

    private LocalDate fechaFin;
}
