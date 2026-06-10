package com.proyectogobuss.dto.ayudante;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AyudanteUpdateRequest {
    private String nombres;
    private String celular;
    private String conductorAsignadoCedula;
}
