package com.gymmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AuthDTO {

    @Data
    public static class LoginRequest {
        @NotBlank(message = "El usuario es requerido")
        private String username;

        @NotBlank(message = "La contraseña es requerida")
        private String password;
    }

    @Data
    public static class LoginResponse {
        private String token;
        private String username;
        private String role;

        public LoginResponse(String token, String username, String role) {
            this.token = token;
            this.username = username;
            this.role = role;
        }
    }

    @Data
    public static class RegisterRequest {
        @NotBlank(message = "El usuario es requerido")
        private String username;

        @NotBlank(message = "La contraseña es requerida")
        private String password;
    }
}
