package com.proyectogobuss.dto.ayudante;

import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AyudanteUpdateRequest {
    @NotBlank
    private String nombres;
    @NotBlank
    private String celular;
    @NotBlank
    private String conductorAsignadoCedula;
}
