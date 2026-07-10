package com.proyectogobuss.security;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("coopGuard")
public class CooperativaAccessGuard {

    public boolean canRead(Authentication auth, String ruc) {
        return isAdmin(auth) || ownsRuc(auth, ruc);
    }

    public boolean canWrite(Authentication auth, String ruc) {
        return ownsRuc(auth, ruc);
    }

    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private boolean ownsRuc(Authentication auth, String ruc) {
        return auth.getName() != null && auth.getName().equals(ruc);
    }
}
