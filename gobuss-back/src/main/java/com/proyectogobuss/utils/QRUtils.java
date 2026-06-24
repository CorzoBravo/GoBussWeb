package com.proyectogobuss.utils;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;

import java.io.File;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

public final class QRUtils {

    private QRUtils() {}

    public static void generarPng(String contenido, File outFile, int size) throws Exception {
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        hints.put(EncodeHintType.MARGIN, 1);

        BitMatrix matrix = new MultiFormatWriter()
                .encode(contenido, BarcodeFormat.QR_CODE, size, size, hints);

        Path path = outFile.toPath();
        MatrixToImageWriter.writeToPath(matrix, "PNG", path);
    }
}

