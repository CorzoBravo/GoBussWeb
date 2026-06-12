package com.proyectogobuss.dto.horario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasajeroDTO {
    private String cedula;
    private String nombre;
    private Integer numeroAsiento;
    private String numeroBoleto;
    private String estado;
}
