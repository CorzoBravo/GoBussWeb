package com.proyectogobuss.dto.conductor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConductorDTO {
    private String cedula;
    private String nombre;
    private String celular;
    private String rucCooperativa;
    private Integer idRutaAsignada;
    private Integer idUnidadAsignada;
}
