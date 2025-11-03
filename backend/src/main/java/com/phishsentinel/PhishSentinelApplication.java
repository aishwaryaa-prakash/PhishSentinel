package com.phishsentinel;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean; // <-- Import
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // <-- Import
import org.springframework.security.crypto.password.PasswordEncoder; // <-- Import

@SpringBootApplication
public class PhishSentinelApplication {
    

    public static void main(String[] args) {
        SpringApplication.run(PhishSentinelApplication.class, args);
        System.out.println("PhishSentinel backend is running...");
    }

    // ⭐ THIS BEAN MUST BE HERE
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}