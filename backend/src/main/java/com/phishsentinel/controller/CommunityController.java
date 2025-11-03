package com.phishsentinel.controller;

import com.phishsentinel.dto.ApiResponse;
import com.phishsentinel.model.User;
import com.phishsentinel.model.UserProfile;
import com.phishsentinel.repository.UserRepository;
import com.phishsentinel.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/community")
@CrossOrigin(origins = "*")
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    @Autowired
    private UserRepository userRepository;

    // ✅ Get UserProfile by email (instead of username)
    @GetMapping("/profile/{email}")
    public ResponseEntity<ApiResponse<UserProfile>> getUserProfile(@PathVariable String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = communityService.getUserProfile(user.getId());

        ApiResponse<UserProfile> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setData(profile);

        return ResponseEntity.ok(response);
    }

    // Add more community endpoints as needed
}
