package com.proyectogobuss.EmailService;

import java.io.InputStream;
import java.util.Properties;

public final class BrevoConfig {

    private static final Properties props = new Properties();

    static {
        try (InputStream in =
                     BrevoConfig.class
                     .getClassLoader()
                     .getResourceAsStream("application.properties")) {

            if (in == null) {
                throw new RuntimeException("No se encontró application.properties");
            }
            props.load(in);

        } catch (Exception e) {
            throw new RuntimeException("Error cargando configuración Brevo", e);
        }
    }

    public static String apiKey() {
        return props.getProperty("brevo.api.key");
    }

    public static String senderEmail() {
        return props.getProperty("brevo.sender.email");
    }

    public static String senderName() {
        return props.getProperty("brevo.sender.name");
    }
}
