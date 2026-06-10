package com.proyectogobuss.dto.ruta;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RutaGeneralDTO {

    private Integer id;

    private CiudadDTO origen;

    private CiudadDTO destino;
}
