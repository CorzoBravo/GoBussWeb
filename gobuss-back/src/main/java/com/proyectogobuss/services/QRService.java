package com.proyectogobuss.services;

import com.proyectogobuss.Entities.Boleto;

import com.proyectogobuss.utils.FileUtils;
import com.proyectogobuss.utils.QRUtils;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.stream.Collectors;

@Service
public class QRService {

    public File generarQr(Boleto boleto) throws Exception {

      
        String asientos = boleto.getAsientos()
                .stream()
                .map(a -> String.valueOf(a.getNumeroAsiento()))
                .collect(Collectors.joining(", "));

        String contenidoQR =
                "BOLETO: " + boleto.getIdBoleto() + "\n" +
                "PASAJERO: " + boleto.getUsuario().getNombres() + "\n" +
                "CEDULA: " + boleto.getUsuario().getCedula() + "\n" +
                "RUTA: " + boleto.getHorario().getRutaFinal().getRutaGeneral().getOrigen() +
                " - " + boleto.getHorario().getRutaFinal().getRutaGeneral().getDestino() + "\n" +
                "FECHA VIAJE: " + boleto.getFechaViaje() + "\n" +
                "ASIENTOS: " + asientos + "\n" +
                "MONTO: $" + boleto.getMonto();

        File qrFile = FileUtils.fileIn(
                "files/qr",
                "qr_boleto_" + boleto.getIdBoleto() + ".png"
        );

        QRUtils.generarPng(contenidoQR, qrFile, 300);
        return qrFile;
    }
}

