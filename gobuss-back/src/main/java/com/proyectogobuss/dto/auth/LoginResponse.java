package com.proyectogobuss.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;

    @JsonProperty("refresh_token")
    private String refreshToken;

    @JsonProperty("expires_in")
    private long expiresIn;

    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("user_type")
    private String userType;

    private String role;

    @JsonProperty("user_details")
    private UserDetailsResponse userDetails;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserDetailsResponse {
        private String id;
        private String nombre;
        private String email;
        private String tipo;
    }
}
