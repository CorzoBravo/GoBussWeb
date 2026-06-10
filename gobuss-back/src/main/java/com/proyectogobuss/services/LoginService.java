package com.proyectogobuss.Services;

import com.proyectogobuss.Entities.UsersEntities.Admin;
import com.proyectogobuss.Entities.UsersEntities.Cooperativa;
import com.proyectogobuss.Entities.UsersEntities.Usuario;
import com.proyectogobuss.JPAController.UsersJPAControllers.AdminJPAController;
import com.proyectogobuss.JPAController.UsersJPAControllers.CooperativaJPAController;
import com.proyectogobuss.JPAController.UsersJPAControllers.UsuarioJPAController;

import Utils.PasswordUtils;

public class LoginService {

    public enum LoginType {
        ADMIN,
        COOPERATIVA,
        USUARIO,
        INVALIDO
    }

    public static Object login(String id, String clave) {

        String hash = PasswordUtils.hash(clave);

        
        Admin admin = new AdminJPAController().find(id);
        if (admin != null && admin.getClave().equals(hash)) {
            return admin;
        }

      
        Cooperativa coop = new CooperativaJPAController().findByRuc(id);
        if (coop != null && coop.getClave().equals(hash)) {
            return coop;
        }

    
        Usuario usuario = new UsuarioJPAController().buscarPorCedula(id);
        if (usuario != null && usuario.getClave().equals(hash)) {
            return usuario;
        }

        return null;
    }
}
