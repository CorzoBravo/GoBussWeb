package com.proyectogobuss.Services;

import java.util.List;

import com.proyectogobuss.Entities.CoopEntities.Horario;
import com.proyectogobuss.Entities.UsersEntities.Admin;
import com.proyectogobuss.Entities.UsersEntities.Cooperativa;
import com.proyectogobuss.Entities.UsersEntities.Usuario;

public class SessionData {

    public static Admin admin;
    public static Cooperativa cooperativa;
    public static Usuario usuario;
    public static Horario horarioSeleccionado;
    public static List<Integer> asientosSeleccionados;

    public static void clear() {
        admin = null;
        cooperativa = null;
        usuario = null;
    }
}
