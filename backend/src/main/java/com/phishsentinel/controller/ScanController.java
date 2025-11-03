package com.phishsentinel.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import com.phishsentinel.service.ScanService;

@RestController
@RequestMapping("/api/scan")
public class ScanController {

    @Autowired
    private ScanService scanService;

    // Endpoint: GET /api/scan/url?url=https://example.com&userId=1
    @GetMapping("/url")
    public ResponseEntity<?> scanUrl(
            @RequestParam String url,
            @RequestParam String userId
    ) {
        try {
            // Convert safely
            Long parsedUserId = Long.parseLong(userId.trim());


            // Call service and handle response
            Object scanResult = scanService.scanUrl(url, parsedUserId);

            if (scanResult == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Scan service returned null or failed to connect.");
            }

            return ResponseEntity.ok(scanResult);

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid userId format: must be a number.");
        } catch (Exception e) {
            e.printStackTrace(); // for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error while processing scan request: " + e.getMessage());
        }
    }
}
