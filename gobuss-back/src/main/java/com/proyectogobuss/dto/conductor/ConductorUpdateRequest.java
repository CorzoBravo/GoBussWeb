package com.proyectogobuss.dto.conductor;

import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConductorUpdateRequest {
    @NotBlank
    private String nombre;
    @NotBlank
    private String celular;
    @NotNull
    private Integer idRutaAsignada;
    @NotNull
    private Integer idUnidadAsignada;
}
