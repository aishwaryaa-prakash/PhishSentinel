package com.phishsentinel.config;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        response.put("message", "Validation failed");
        response.put("errors", errors);
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        Map<String, String> response = new HashMap<>();
        String errorMessage = ex.getMessage();
        
        // Check for specific constraint violations
        if (errorMessage != null) {
            if (errorMessage.contains("username") || errorMessage.contains("users_username_key")) {
                response.put("message", "Error: Username is already taken!");
            } else if (errorMessage.contains("email") || errorMessage.contains("users_email_key")) {
                response.put("message", "Error: Email is already in use!");
            } else {
                response.put("message", "Error: Data integrity violation. This username or email may already exist.");
            }
        } else {
            response.put("message", "Error: Username or email already exists!");
        }
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        Map<String, String> response = new HashMap<>();
        String message = ex.getMessage();
        
        // Log the full exception for debugging
        ex.printStackTrace();
        
        // Provide a user-friendly message
        if (message != null && message.contains("ConstraintViolation")) {
            response.put("message", "Error: Username or email already exists!");
        } else {
            response.put("message", message != null ? message : "An error occurred during signup");
        }
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}

