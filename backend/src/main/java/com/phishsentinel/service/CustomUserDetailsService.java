package com.phishsentinel.service;

import com.phishsentinel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        com.phishsentinel.model.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Create authorities based on user role
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        if (user.getRole() != null && !user.getRole().isEmpty()) {
            // Add ROLE_ prefix as Spring Security convention
            String role = user.getRole().startsWith("ROLE_") ? user.getRole() : "ROLE_" + user.getRole();
            authorities.add(new SimpleGrantedAuthority(role));
        } else {
            // Default to USER role if none specified
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }

        return new User(user.getEmail(), user.getPassword(), authorities);
    }
}
