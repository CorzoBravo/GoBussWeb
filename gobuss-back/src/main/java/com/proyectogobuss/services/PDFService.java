package com.proyectogobuss.services;

import com.proyectogobuss.Entities.Boleto;

import com.proyectogobuss.utils.FileUtils;
import com.proyectogobuss.utils.PDFUtils;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class PDFService {

    public File generarPdf(Boleto boleto, File qrImage) throws Exception {

        File pdfFile = FileUtils.fileIn(
                "files/pdf",
                "boleto_" + boleto.getIdBoleto() + ".pdf"
        );

        PDFUtils.generarPdfBoleto(boleto, qrImage, pdfFile);
        return pdfFile;
    }
}

