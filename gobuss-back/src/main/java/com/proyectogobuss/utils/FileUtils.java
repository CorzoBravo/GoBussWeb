package com.proyectogobuss.utils;

import java.io.File;

public final class FileUtils {

    private FileUtils() {}

    public static File ensureDir(String path) {
        File dir = new File(path);
        if (!dir.exists()) {
            boolean ok = dir.mkdirs();
            if (!ok) throw new RuntimeException("No se pudo crear la carpeta: " + path);
        }
        return dir;
    }

    public static File fileIn(String dir, String filename) {
        ensureDir(dir);
        return new File(dir, filename);
    }
}

