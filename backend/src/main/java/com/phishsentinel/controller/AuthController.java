package com.phishsentinel.controller;

import com.phishsentinel.dto.*;
import com.phishsentinel.model.User;
import com.phishsentinel.repository.UserRepository;
import com.phishsentinel.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email already in use"));
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole("USER");
        user.setCreatedAt(new Date());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        UserResponse userResponse = new UserResponse(user.getId().toString(), user.getUsername(), user.getEmail(), user.getRole());
        AuthResponse authResponse = new AuthResponse(token, userResponse);

        return ResponseEntity.ok(ApiResponse.success("Registration successful", authResponse));
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

            Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("User not found"));
            }

            User user = userOptional.get();
            String token = jwtUtil.generateToken(user.getEmail());

            UserResponse userResponse = new UserResponse(
                    user.getId().toString(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole()
            );

            AuthResponse authResponse = new AuthResponse(token, userResponse);
            return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid email or password"));
        }
    }
}
