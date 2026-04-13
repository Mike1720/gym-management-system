package com.gymmanagement;

import com.gymmanagement.dto.AuthDTO;
import com.gymmanagement.entity.User;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        // Crear usuario de prueba
        if (!userRepository.existsByUsername("testadmin")) {
            User user = User.builder()
                    .username("testadmin")
                    .password(passwordEncoder.encode("password123"))
                    .role("ADMIN")
                    .build();
            userRepository.save(user);
        }
    }

    @Test
    void testLoginExitoso() {
        AuthDTO.LoginRequest request = new AuthDTO.LoginRequest();
        request.setUsername("testadmin");
        request.setPassword("password123");

        AuthDTO.LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("testadmin", response.getUsername());
        assertEquals("ADMIN", response.getRole());
    }

    @Test
    void testLoginCredencialesInvalidas() {
        AuthDTO.LoginRequest request = new AuthDTO.LoginRequest();
        request.setUsername("testadmin");
        request.setPassword("wrongpassword");

        assertThrows(Exception.class, () -> authService.login(request));
    }

    @Test
    void testRegistroUsuarioNuevo() {
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setUsername("newuser");
        request.setPassword("newpassword");

        assertDoesNotThrow(() -> authService.register(request));
        assertTrue(userRepository.existsByUsername("newuser"));
    }

    @Test
    void testRegistroUsuarioDuplicado() {
        AuthDTO.RegisterRequest request = new AuthDTO.RegisterRequest();
        request.setUsername("testadmin");
        request.setPassword("anypassword");

        assertThrows(RuntimeException.class, () -> authService.register(request));
    }
}
