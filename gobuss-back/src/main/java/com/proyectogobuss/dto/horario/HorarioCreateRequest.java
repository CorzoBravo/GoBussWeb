package com.proyectogobuss.dto.horario;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HorarioCreateRequest {

    @NotNull(message = "Ruta final ID is required")
    @NotNull
    private Integer rutaFinalId;

    @NotNull(message = "Unidad ID is required")
    @NotNull
    private Integer unidadId;

    @NotNull(message = "Fecha is required")
    private LocalDate fecha;

    @NotNull(message = "Hora salida is required")
    @NotBlank
    private String horaSalida;
}
