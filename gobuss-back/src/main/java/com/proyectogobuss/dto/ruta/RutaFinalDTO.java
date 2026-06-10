package com.proyectogobuss.dto.ruta;

import com.proyectogobuss.dto.cooperativa.CooperativaDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RutaFinalDTO {

    private Integer id;

    private RutaGeneralDTO rutaGeneral;

    private CooperativaDTO cooperativa;

    private Double precio;
}
