package com.proyectogobuss.dto.conductor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConductorUpdateRequest {
    private String nombre;
    private String celular;
    private Integer idRutaAsignada;
    private Integer idUnidadAsignada;
}
