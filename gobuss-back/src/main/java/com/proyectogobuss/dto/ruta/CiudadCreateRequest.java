package com.proyectogobuss.dto.ruta;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CiudadCreateRequest {

    @NotBlank(message = "Nombre is required")
    private String nombre;
}
