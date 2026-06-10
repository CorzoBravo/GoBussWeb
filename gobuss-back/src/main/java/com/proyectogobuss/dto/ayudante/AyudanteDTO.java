package com.proyectogobuss.dto.ayudante;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AyudanteDTO {
    private String cedula;
    private String nombres;
    private String celular;
    private String conductorAsignadoCedula;
}
