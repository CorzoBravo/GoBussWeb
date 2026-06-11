package com.proyectogobuss.dto.ruta;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RutaGeneralCreateRequest {

    @NotNull(message = "Origen ID is required")
    @NotNull
    private Integer origenId;

    @NotNull(message = "Destino ID is required")
    @NotNull
    private Integer destinoId;
}
