package com.proyectogobuss.dto.boleto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoletoCreateRequest {

    @NotNull(message = "Horario ID is required")
    private Integer horarioId;

    @NotEmpty(message = "At least one seat must be selected")
    private List<Integer> asientos;
}
