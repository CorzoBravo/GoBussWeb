package com.proyectogobuss.dto.cooperativa;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CooperativaDTO {

    private String ruc;

    private String nombre;

    private String direccion;

    private String correo;

    private String telefono;
    
    private String estado;
}
