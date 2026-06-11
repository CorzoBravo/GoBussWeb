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
public class RutaFinalUpdateRequest {

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double precio;
}
