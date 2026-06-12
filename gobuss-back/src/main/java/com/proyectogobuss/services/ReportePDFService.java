package com.proyectogobuss.services;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.proyectogobuss.dto.ReporteOcupacionHorarioDTO;
import com.proyectogobuss.dto.ReporteVentasFechaDTO;
import com.proyectogobuss.dto.ReporteVentasRutaDTO;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReportePDFService {

        public void generarReporteVentasRuta(
                        List<ReporteVentasRutaDTO> datos,
                        OutputStream destino) throws Exception {

                Document doc = new Document(PageSize.A4);
                PdfWriter.getInstance(doc, destino);
                doc.open();

                Font titulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
                Font normal = FontFactory.getFont(FontFactory.HELVETICA, 11);

                doc.add(new Paragraph("Reporte de Ventas por Ruta", titulo));
                doc.add(new Paragraph(" "));

                PdfPTable tabla = new PdfPTable(3);
                tabla.setWidthPercentage(100);
                tabla.setWidths(new float[] { 4, 2, 2 });

                tabla.addCell("Ruta");
                tabla.addCell("Boletos");
                tabla.addCell("Total Vendido");

                double totalGeneral = 0;

                for (ReporteVentasRutaDTO r : datos) {
                        tabla.addCell(r.getRuta());
                        tabla.addCell(String.valueOf(r.getCantidadBoletos()));
                        tabla.addCell(String.format("$%.2f", r.getTotalVendido()));
                        totalGeneral += r.getTotalVendido();
                }

                doc.add(tabla);
                doc.add(new Paragraph(" "));
                doc.add(new Paragraph(
                                "Total General: $" + String.format("%.2f", totalGeneral),
                                normal));

                doc.close();
        }

        public void generarVentasPorFecha(
                        List<ReporteVentasFechaDTO> datos,
                        OutputStream destino,
                        String rucCooperativa) throws Exception {

                Document doc = new Document(PageSize.A4);
                PdfWriter.getInstance(doc, destino);
                doc.open();

                Font titulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
                Font encabezado = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);
                Font normal = FontFactory.getFont(FontFactory.HELVETICA, 11);

                DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");

                doc.add(new Paragraph("Reporte de Ventas por Fecha", titulo));
                doc.add(new Paragraph("Cooperativa (RUC): " + rucCooperativa, normal));
                doc.add(new Paragraph("Fecha de generación: " +
                                LocalDate.now().format(fmt), normal));
                doc.add(new Paragraph(" "));

                PdfPTable tabla = new PdfPTable(3);
                tabla.setWidthPercentage(100);
                tabla.setWidths(new float[] { 3, 2, 2 });

                tabla.addCell(new PdfPCell(new Phrase("Fecha", encabezado)));
                tabla.addCell(new PdfPCell(new Phrase("Boletos Vendidos", encabezado)));
                tabla.addCell(new PdfPCell(new Phrase("Total Vendido", encabezado)));

                double totalGeneral = 0;

                for (ReporteVentasFechaDTO r : datos) {
                        tabla.addCell(new PdfPCell(new Phrase(
                                        r.getFecha().format(fmt), normal)));
                        tabla.addCell(new PdfPCell(new Phrase(
                                        String.valueOf(r.getCantidadBoletos()), normal)));
                        tabla.addCell(new PdfPCell(new Phrase(
                                        String.format("$%.2f", r.getTotalVendido()), normal)));

                        totalGeneral += r.getTotalVendido();
                }

                doc.add(tabla);
                doc.add(new Paragraph(" "));
                doc.add(new Paragraph(
                                "Total General: $" + String.format("%.2f", totalGeneral),
                                encabezado));

                doc.close();
        }

        public void generarReporteOcupacionHorario(
                        List<ReporteOcupacionHorarioDTO> datos,
                        OutputStream destino,
                        String rucCooperativa) throws Exception {

                Document doc = new Document(PageSize.A4.rotate());
                PdfWriter.getInstance(doc, destino);
                doc.open();

                Font titulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
                Font normal = FontFactory.getFont(FontFactory.HELVETICA, 10);
                Font header = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);

                doc.add(new Paragraph("Reporte de Ocupación por Horario", titulo));
                doc.add(new Paragraph("Cooperativa (RUC): " + rucCooperativa, normal));
                doc.add(new Paragraph(" "));

                PdfPTable tabla = new PdfPTable(7);
                tabla.setWidthPercentage(100);
                tabla.setWidths(new float[] { 4, 2, 2, 2, 2, 2, 2 });

                tabla.addCell(new PdfPCell(new Phrase("Ruta", header)));
                tabla.addCell(new PdfPCell(new Phrase("Fecha", header)));
                tabla.addCell(new PdfPCell(new Phrase("Hora", header)));
                tabla.addCell(new PdfPCell(new Phrase("Unidad", header)));
                tabla.addCell(new PdfPCell(new Phrase("Ocupados", header)));
                tabla.addCell(new PdfPCell(new Phrase("Capacidad", header)));
                tabla.addCell(new PdfPCell(new Phrase("% Ocupación", header)));

                for (ReporteOcupacionHorarioDTO r : datos) {
                        tabla.addCell(new Phrase(r.getRuta(), normal));
                        tabla.addCell(new Phrase(r.getFecha().toString(), normal));
                        tabla.addCell(new Phrase(String.valueOf(r.getHora()), normal));
                        tabla.addCell(new Phrase(r.getUnidad(), normal));
                        tabla.addCell(new Phrase(String.valueOf(r.getAsientosOcupados()), normal));
                        tabla.addCell(new Phrase(String.valueOf(r.getCapacidad()), normal));
                        tabla.addCell(new Phrase(
                                        String.format("%.2f %%", r.getPorcentaje()), normal));
                }

                doc.add(tabla);
                doc.close();
        }
}
