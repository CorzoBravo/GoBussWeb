package com.proyectogobuss.services;

import com.proyectogobuss.Entities.Boleto;
import com.proyectogobuss.repositories.BoletoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;

@Slf4j
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
            log.error("Error procesando boleto id={}", boleto.getIdBoleto(), e);
            throw new RuntimeException(
                    "No se pudo procesar y enviar el boleto", e);
        }
    }
}
