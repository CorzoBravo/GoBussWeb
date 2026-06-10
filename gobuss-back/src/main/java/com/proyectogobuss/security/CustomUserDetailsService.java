package com.proyectogobuss.security;

import com.proyectogobuss.repositories.AdminRepository;
import com.proyectogobuss.repositories.CooperativaRepository;
import com.proyectogobuss.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final CooperativaRepository cooperativaRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try to find in Admin
        var admin = adminRepository.findById(username);
        if (admin.isPresent()) {
            return User.builder()
                    .username(username)
                    .password(admin.get().getClave())
                    .authorities(getAuthorities("ADMIN"))
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .disabled(false)
                    .build();
        }

        // Try to find in Cooperativa
        var cooperativa = cooperativaRepository.findByRuc(username);
        if (cooperativa.isPresent()) {
            return User.builder()
                    .username(username)
                    .password(cooperativa.get().getClave())
                    .authorities(getAuthorities("COOPERATIVA"))
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .disabled(false)
                    .build();
        }

        // Try to find in Usuario
        var usuario = usuarioRepository.findByCedula(username);
        if (usuario.isPresent()) {
            return User.builder()
                    .username(username)
                    .password(usuario.get().getClave())
                    .authorities(getAuthorities("USUARIO"))
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .disabled(false)
                    .build();
        }

        throw new UsernameNotFoundException("User not found with username: " + username);
    }

    private Collection<? extends GrantedAuthority> getAuthorities(String role) {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role));
    }
}
