package com.proyectogobuss.Entities.RutaEntities;

import jakarta.persistence.*;

@Entity
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

    public RutaGeneral() {
    }

    public RutaGeneral(Ciudad origen, Ciudad destino) {
        this.origen = origen;
        this.destino = destino;
    }

    public Integer getIdRutaGeneral() {
        return idRutaGeneral;
    }

    public void setIdRutaGeneral(Integer idRutaGeneral) {
        this.idRutaGeneral = idRutaGeneral;
    }

    public Ciudad getOrigen() {
        return origen;
    }

    public void setOrigen(Ciudad origen) {
        this.origen = origen;
    }

    public Ciudad getDestino() {
        return destino;
    }

    public void setDestino(Ciudad destino) {
        this.destino = destino;
    }

    @Column(nullable = false)
    private boolean activo = true;
}