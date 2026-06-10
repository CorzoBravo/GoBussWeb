package com.proyectogobuss.dto.unidad;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnidadUpdateRequest {

    @NotBlank(message = "Placa is required")
    private String placa;

    @NotBlank(message = "Modelo is required")
    private String modelo;

    @Min(value = 5, message = "Capacidad must be at least 5")
    private Integer capacidad;

    private String fabricado;
}
