package com.proyectogobuss.dto.unidad;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnidadCreateRequest {

    @NotNull(message = "Número is required")
    @Min(value = 1, message = "Número must be positive")
    private Integer numero;

    @NotBlank(message = "Placa is required")
    private String placa;

    @NotBlank(message = "Modelo is required")
    private String modelo;

    @NotNull(message = "Capacidad is required")
    @Min(value = 5, message = "Capacidad must be at least 5")
    private Integer capacidad;

    private String fabricado;
}
