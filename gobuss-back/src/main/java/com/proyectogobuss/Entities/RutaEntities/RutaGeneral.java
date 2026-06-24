package com.proyectogobuss.Entities.RutaEntities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "ruta_general")
public class RutaGeneral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ruta_general")
    private Integer idRutaGeneral;

    @ManyToOne
    @JoinColumn(name = "idOrigen", nullable = false)
    private Ciudad origen;

    @ManyToOne
    @JoinColumn(name = "idDestino", nullable = false)
    private Ciudad destino;



    public RutaGeneral(Ciudad origen, Ciudad destino) {
        this.origen = origen;
        this.destino = destino;
    }

    @Column(nullable = false)
    private boolean activo = true;
}

