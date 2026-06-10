package com.proyectogobuss.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardDTO {

    private long totalCooperativas;

    private long totalUsuarios;

    private long totalViajes;

    private double totalVentas;

    private int capacidadPromedio;
}
