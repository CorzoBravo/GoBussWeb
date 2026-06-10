package com.proyectogobuss.repositories;

import com.proyectogobuss.Entities.UsersEntities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {

    Optional<Usuario> findByCedula(String cedula);

    Optional<Usuario> findByCorreo(String correo);

    boolean existsByCedula(String cedula);

    boolean existsByCorreo(String correo);
}
