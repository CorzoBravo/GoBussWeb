package com.proyectogobuss.services;

import com.proyectogobuss.Entities.UsersEntities.Admin;
import com.proyectogobuss.Entities.UsersEntities.Cooperativa;
import com.proyectogobuss.Entities.UsersEntities.Usuario;
import com.proyectogobuss.dto.auth.LoginRequest;
import com.proyectogobuss.dto.auth.LoginResponse;
import com.proyectogobuss.exception.UnauthorizedException;
import com.proyectogobuss.repositories.AdminRepository;
import com.proyectogobuss.repositories.CooperativaRepository;
import com.proyectogobuss.repositories.UsuarioRepository;
import com.proyectogobuss.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final AdminRepository adminRepository;
    private final CooperativaRepository cooperativaRepository;
    private final UsuarioRepository usuarioRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        String userId = request.getId();
        String password = request.getPassword();

        // Try Admin login
        var admin = adminRepository.findById(userId);
        if (admin.isPresent() && passwordEncoder.matches(password, admin.get().getClave())) {
            return buildLoginResponse(userId, "ADMIN", "ADMIN", admin.get().getId(), null);
        }

        // Try Cooperativa login
        var cooperativa = cooperativaRepository.findByRuc(userId);
        if (cooperativa.isPresent() && passwordEncoder.matches(password, cooperativa.get().getClave())) {
            return buildLoginResponse(userId, "COOPERATIVA", "COOPERATIVA",
                    cooperativa.get().getRuc(), cooperativa.get().getNombre());
        }

        // Try Usuario login
        var usuario = usuarioRepository.findByCedula(userId);
        if (usuario.isPresent() && passwordEncoder.matches(password, usuario.get().getClave())) {
            return buildLoginResponse(userId, "USUARIO", "USUARIO",
                    usuario.get().getCedula(), usuario.get().getNombres());
        }

        throw new UnauthorizedException("Invalid credentials");
    }

    public LoginResponse registerUsuario(LoginRequest request, String cedula, String nombres, String email) {
        if (usuarioRepository.existsByCedula(cedula)) {
            throw new UnauthorizedException("Cedula already registered");
        }

        if (usuarioRepository.existsByCorreo(email)) {
            throw new UnauthorizedException("Email already registered");
        }

        Usuario usuario = new Usuario();
        usuario.setCedula(cedula);
        usuario.setNombres(nombres);
        usuario.setCorreo(email);
        usuario.setClave(passwordEncoder.encode(request.getPassword()));

        usuarioRepository.save(usuario);

        log.info("Usuario registered: {}", cedula);
        return buildLoginResponse(cedula, "USUARIO", "USUARIO", cedula, nombres);
    }

    private LoginResponse buildLoginResponse(String userId, String userType, String role,
                                            String id, String nombre) {
        String token = tokenProvider.generateToken(userId, userType, role);
        String refreshToken = tokenProvider.generateRefreshToken(userId);

        var userDetails = LoginResponse.UserDetailsResponse.builder()
                .id(id)
                .nombre(nombre)
                .tipo(userType)
                .build();

        return LoginResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .expiresIn(86400000L)
                .userId(userId)
                .userType(userType)
                .role(role)
                .userDetails(userDetails)
                .build();
    }
}
