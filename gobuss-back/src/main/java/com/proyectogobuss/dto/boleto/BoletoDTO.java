package com.proyectogobuss.dto.boleto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoletoDTO {
    private Integer idBoleto;
    private String usuarioCedula;
    private String usuarioNombre;
    private Integer horarioId;
    private String rutaInfo;
    private LocalDate fechaViaje;
    private LocalDateTime fechaCompra;
    private Double monto;
    private Integer cantidadAsientos;
    private List<Integer> asientos;
}
