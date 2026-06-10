package com.proyectogobuss.dto.ayudante;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AyudanteCreateRequest {
    @NotBlank(message = "Cedula is required")
    private String cedula;

    @NotBlank(message = "Nombres is required")
    private String nombres;

    private String celular;
    private String conductorAsignadoCedula;
}
