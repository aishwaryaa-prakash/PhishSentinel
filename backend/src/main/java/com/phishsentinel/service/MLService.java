package com.phishsentinel.service;

import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MLService {

    // Your FastAPI endpoint
    private static final String ML_API_URL = "http://127.0.0.1:5000/predict";

    // Connects to the FastAPI microservice
    public String predict(String url) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // ✅ Prepare request body (use correct key name)
            JSONObject requestBody = new JSONObject();
            requestBody.put("url", url);

            // ✅ Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // ✅ Combine headers and body
            HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

            // ✅ Send POST request to FastAPI
            ResponseEntity<String> response = restTemplate.exchange(
                    ML_API_URL,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            // ✅ Return response body as plain text (you can parse JSON later)
            return response.getBody();

        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"Failed to connect to ML API\"}";
        }
    }

    // Optional — if your FastAPI also returns confidence scores later
    public Double getConfidenceScore(String url) {
        // for now, you can return a dummy value or parse from FastAPI response later
        return 0.95;
    }
}
