package com.proyectogobuss.Entities.CoopEntities;

import jakarta.persistence.*;

@Entity
@Table(name = "unidad")
public class Unidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idUnidad")
    private int idUnidad;

    @Column(name = "ruc", nullable = false)
    private String ruc;

    @Column(name = "numero", nullable = false)
    private int numero;

    @Column(name = "placa")
    private String placa;

    @Column(name = "fabricado")
    private String fabricado;

    @Column(name = "modelo")
    private String modelo;

    @Column(name = "capacidad")
    private int capacidad;


    public int getIdUnidad() {
        return idUnidad;
    }

    public void setIdUnidad(int idUnidad) {
        this.idUnidad = idUnidad;
    }

    public String getRuc() {
        return ruc;
    }

    public void setRuc(String ruc) {
        this.ruc = ruc;
    }

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getFabricado() {
        return fabricado;
    }

    public void setFabricado(String fabricado) {
        this.fabricado = fabricado;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public int getCapacidad() {
        return capacidad;
    }

    public void setCapacidad(int capacidad) {
        this.capacidad = capacidad;
    }

    @Override
    public String toString() {
        return "Unidad " + numero + " â€¢ Placa: " + placa;
    }


    @Column(nullable = false)
    private boolean activo = true;
}