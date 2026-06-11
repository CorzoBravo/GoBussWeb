package com.proyectogobuss.dto.ruta;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RutaFinalCreateRequest {

    @NotNull(message = "Ruta General ID is required")
    @NotNull
    private Integer rutaGeneralId;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double precio;
}
