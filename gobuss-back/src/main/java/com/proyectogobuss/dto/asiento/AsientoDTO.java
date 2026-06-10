package com.proyectogobuss.dto.asiento;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AsientoDTO {

    private Integer idReserva;

    private Integer numeroAsiento;

    private String estado;

    private Integer numeroBoleto;
}
