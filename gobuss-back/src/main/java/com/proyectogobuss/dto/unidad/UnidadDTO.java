package com.proyectogobuss.dto.unidad;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnidadDTO {

    private Integer idUnidad;

    private Integer numero;

    private String placa;

    private String modelo;

    private Integer capacidad;

    private String fabricado;
}
