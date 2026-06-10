package com.proyectogobuss.services;

import com.proyectogobuss.Entities.Boleto;
import com.proyectogobuss.repositories.BoletoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
@RequiredArgsConstructor
public class BoletoService {

    private final QRService qrService;
    private final PDFService pdfService;
    private final EmailServiceBrevo emailService;
    private final BoletoRepository boletoRepository;

    public void procesarYEnviarBoleto(Boleto boleto) {

        try {
            Boleto boletoDB = boletoRepository.findCompleto(boleto.getIdBoleto());

            File qr = qrService.generarQr(boletoDB);

            File pdf = pdfService.generarPdf(boletoDB, qr);

            emailService.enviarBoleto(boletoDB, pdf);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(
                    "No se pudo procesar y enviar el boleto", e);
        }
    }
}
