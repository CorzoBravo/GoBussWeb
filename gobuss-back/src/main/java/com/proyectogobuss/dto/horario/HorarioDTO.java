package com.proyectogobuss.dto.horario;

import com.proyectogobuss.dto.ruta.RutaFinalDTO;
import com.proyectogobuss.dto.unidad.UnidadDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HorarioDTO {

    private Integer idHorario;

    private LocalDate fecha;

    private LocalTime horaSalida;

    private UnidadDTO unidad;

    private RutaFinalDTO rutaFinal;

    private Boolean activo;

    private Integer asientosDisponibles;

    private Integer asientosReservados;
}
