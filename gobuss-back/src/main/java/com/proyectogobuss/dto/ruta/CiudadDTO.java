package com.proyectogobuss.dto.ruta;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CiudadDTO {

    private Integer id;

    private String nombre;
}
