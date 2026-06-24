package com.proyectogobuss.services;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.proyectogobuss.Entities.Boleto;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.util.Base64;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class EmailServiceBrevo {

    private static final String BREVO_URL = "https://api.brevo.com/v3/smtp/email";

    @Value("${brevo.api.key}")
    private String apiKey;

    @Value("${brevo.sender.email:info@gobuss.com}")
    private String senderEmail;

    @Value("${brevo.sender.name:GoBuss}")
    private String senderName;

    private final OkHttpClient client = new OkHttpClient();

    public void enviarBoleto(Boleto boleto, File pdfBoleto) {

        try {
            byte[] pdfBytes = Files.readAllBytes(pdfBoleto.toPath());
            String pdfBase64 = Base64.getEncoder().encodeToString(pdfBytes);

            JsonObject attachment = new JsonObject();
            attachment.addProperty("name", pdfBoleto.getName());
            attachment.addProperty("content", pdfBase64);

            JsonArray attachments = new JsonArray();
            attachments.add(attachment);

            JsonObject to = new JsonObject();
            to.addProperty("email", boleto.getUsuario().getCorreo());
            to.addProperty("name", boleto.getUsuario().getNombres());

            JsonArray toArray = new JsonArray();
            toArray.add(to);

            JsonObject sender = new JsonObject();
            sender.addProperty("email", senderEmail);
            sender.addProperty("name", senderName);

            JsonObject email = new JsonObject();
            email.add("sender", sender);
            email.add("to", toArray);
            email.addProperty("subject", "Tu Boleto GoBuss - " + boleto.getIdBoleto());
            email.addProperty("htmlContent", buildHtmlContent(boleto));
            email.add("attachment", attachments);

            RequestBody body = RequestBody.create(
                    email.toString(),
                    MediaType.get("application/json; charset=utf-8")
            );

            Request request = new Request.Builder()
                    .url(BREVO_URL)
                    .post(body)
                    .addHeader("api-key", apiKey)
                    .addHeader("Content-Type", "application/json")
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    log.error("Error al enviar email. Código: {}", response.code());
                    log.error("Respuesta: {}", response.body() != null ? response.body().string() : "null");
                } else {
                    log.info("Email enviado exitosamente a {}", boleto.getUsuario().getCorreo());
                }
            }
        } catch (Exception e) {
            log.error("Error procesando envio de email: ", e);
        }
    }

    private String buildHtmlContent(Boleto boleto) {
        return "<html><body><h3>Gracias por tu compra, " + boleto.getUsuario().getNombres() + "</h3>" +
               "<p>Adjuntamos tu boleto (ID: " + boleto.getIdBoleto() + ").</p>" +
               "<p>Monto: $" + boleto.getMonto() + "</p>" +
               "</body></html>";
    }
}
