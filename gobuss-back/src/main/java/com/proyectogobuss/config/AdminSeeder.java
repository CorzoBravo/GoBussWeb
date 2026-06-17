package com.proyectogobuss.config;

import com.proyectogobuss.Entities.UsersEntities.Role;
import com.proyectogobuss.Entities.UsersEntities.User;
import com.proyectogobuss.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Verificar si ya existe el usuario admin
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            // Contraseña por defecto: admin123
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setNombre("Administrador General");
            admin.setRole(Role.ADMIN);
            admin.setActivo(true);
            
            userRepository.save(admin);
            System.out.println("============================================");
            System.out.println(" Usuario ADMIN creado exitosamente");
            System.out.println(" Usuario: admin");
            System.out.println(" Contraseña: admin123");
            System.out.println("============================================");
        }
    }
}
