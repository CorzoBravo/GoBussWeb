package com.proyectogobuss.dto.conductor;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConductorCreateRequest {
    @NotBlank(message = "Cedula is required")
    private String cedula;

    @NotBlank(message = "Nombre is required")
    private String nombre;

    private String celular;
    
    private Integer idRutaAsignada;
    private Integer idUnidadAsignada;
}
