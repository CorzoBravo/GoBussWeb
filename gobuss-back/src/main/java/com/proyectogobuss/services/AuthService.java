package com.proyectogobuss.services;

import com.proyectogobuss.Entities.RefreshToken;
import com.proyectogobuss.Entities.UsersEntities.Role;
import com.proyectogobuss.Entities.UsersEntities.User;
import com.proyectogobuss.Entities.UsersEntities.Usuario;
import com.proyectogobuss.dto.auth.LoginRequest;
import com.proyectogobuss.dto.auth.LoginResponse;
import com.proyectogobuss.dto.auth.TokenRefreshRequest;
import com.proyectogobuss.dto.auth.TokenRefreshResponse;
import com.proyectogobuss.exception.UnauthorizedException;
import com.proyectogobuss.repositories.CooperativaRepository;
import com.proyectogobuss.repositories.UserRepository;
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

    private final UserRepository userRepository;
    private final CooperativaRepository cooperativaRepository;
    private final UsuarioRepository usuarioRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;

    public LoginResponse login(LoginRequest request) {
        String username = request.getId();
        String password = request.getPassword();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!user.isActivo()) {
            throw new UnauthorizedException("User account is inactive");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String role = user.getRole().name();
        String nombre = null;

        // Fetch display name based on profile
        if (user.getRole() == Role.COOPERATIVA) {
            var coop = cooperativaRepository.findByRuc(username);
            if (coop.isPresent()) {
                nombre = coop.get().getNombre();
            }
        } else if (user.getRole() == Role.USUARIO) {
            var usuario = usuarioRepository.findByCedula(username);
            if (usuario.isPresent()) {
                nombre = usuario.get().getNombres();
            }
        } else if (user.getRole() == Role.ADMIN) {
            nombre = "Administrador";
        }

        return buildLoginResponse(username, role, role, username, nombre);
    }

    public LoginResponse registerUsuario(LoginRequest request, String cedula, String nombres, String email) {
        if (userRepository.existsByUsername(cedula)) {
            throw new UnauthorizedException("Cedula already registered");
        }

        if (usuarioRepository.existsByCorreo(email)) {
            throw new UnauthorizedException("Email already registered");
        }

        // 1. Create Auth User
        User user = new User();
        user.setUsername(cedula);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USUARIO);
        user.setActivo(true);
        userRepository.save(user);

        // 2. Create Profile
        Usuario usuario = new Usuario();
        usuario.setCedula(cedula);
        usuario.setNombres(nombres);
        usuario.setCorreo(email);
        usuario.setActivo(true);
        usuarioRepository.save(usuario);

        log.info("Usuario registered: {}", cedula);
        return buildLoginResponse(cedula, "USUARIO", "USUARIO", cedula, nombres);
    }

    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        return refreshTokenService.findByToken(request.getRefreshToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name(), user.getRole().name());
                    return TokenRefreshResponse.builder()
                            .accessToken(token)
                            .refreshToken(request.getRefreshToken())
                            .tokenType("Bearer")
                            .build();
                })
                .orElseThrow(() -> new UnauthorizedException("Refresh token is not in database!"));
    }

    public void logout(String username) {
        refreshTokenService.deleteByUsername(username);
    }

    private LoginResponse buildLoginResponse(String userId, String userType, String role,
                                            String id, String nombre) {
        String token = tokenProvider.generateToken(userId, userType, role);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userId);

        var userDetails = LoginResponse.UserDetailsResponse.builder()
                .id(id)
                .nombre(nombre)
                .tipo(userType)
                .build();

        return LoginResponse.builder()
                .token(token)
                .refreshToken(refreshToken.getToken())
                .expiresIn(86400000L)
                .userId(userId)
                .userType(userType)
                .role(role)
                .userDetails(userDetails)
                .build();
    }
}
