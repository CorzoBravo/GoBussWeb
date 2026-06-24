package com.proyectogobuss.utils;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.proyectogobuss.Entities.Boleto;
import com.proyectogobuss.Entities.AsientoReservado;

import java.io.File;
import java.io.FileOutputStream;
import java.util.stream.Collectors;

public final class PDFUtils {

    private PDFUtils() {}

    public static void generarPdfBoleto(Boleto boleto, File qrImage, File pdfOut)
            throws Exception {

        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, new FileOutputStream(pdfOut));
        document.open();

        Font titulo = new Font(Font.HELVETICA, 18, Font.BOLD);
        Font normal = new Font(Font.HELVETICA, 12);
        Font bold = new Font(Font.HELVETICA, 12, Font.BOLD);

        document.add(new Paragraph("BOLETO DE VIAJE - GOBUSS", titulo));
        document.add(Chunk.NEWLINE);

        document.add(new Paragraph("Boleto N°: " + boleto.getIdBoleto(), bold));
        document.add(new Paragraph("Fecha de compra: " + boleto.getFechaCompra(), normal));
        document.add(Chunk.NEWLINE);

        document.add(new Paragraph("Pasajero: " +
                boleto.getUsuario().getNombres(), normal));
        document.add(new Paragraph("Cédula: " +
                boleto.getUsuario().getCedula(), normal));
        document.add(new Paragraph("Correo: " +
                boleto.getUsuario().getCorreo(), normal));

        document.add(Chunk.NEWLINE);

        document.add(new Paragraph(
                "Ruta: " +
                boleto.getHorario().getRutaFinal().getRutaGeneral().getOrigen() +
                " - " +
                boleto.getHorario().getRutaFinal().getRutaGeneral().getDestino(), normal));

        document.add(new Paragraph(
                "Hora salida: " +
                boleto.getHorario().getHoraSalida(), normal));

        document.add(new Paragraph(
                "Fecha viaje: " +
                boleto.getFechaViaje(), normal));

        String asientos = boleto.getAsientos()
                .stream()
                .map(AsientoReservado::getNumeroAsiento)
                .map(String::valueOf)
                .collect(Collectors.joining(", "));

        document.add(new Paragraph("Asientos: " + asientos, normal));
        document.add(new Paragraph(
                "Cantidad de asientos: " +
                boleto.getCantidadAsientos(), normal));

        document.add(Chunk.NEWLINE);

        document.add(new Paragraph(
                "TOTAL A PAGAR: $" +
                boleto.getMonto(), bold));

        document.add(Chunk.NEWLINE);

        Image qr = Image.getInstance(qrImage.getAbsolutePath());
        qr.scaleToFit(150, 150);
        qr.setAlignment(Image.ALIGN_RIGHT);
        document.add(qr);

        document.add(Chunk.NEWLINE);
        document.add(new Paragraph(
                "Presenta este boleto (QR) al momento de abordar.",
                normal));

        document.close();
    }
}

