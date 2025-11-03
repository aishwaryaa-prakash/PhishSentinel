package com.phishsentinel.service;

import com.phishsentinel.model.ScanResult;
import com.phishsentinel.repository.ScanRepository;
import com.phishsentinel.util.MLHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScanService {

    @Autowired
    private ScanRepository scanRepository;

    @Autowired
    private MLService mlService;


    // ✅ userId is now Long, not String
    public ScanResult saveScanResult(String url, Long userId, Double confidenceScore, Boolean isPhishing, String prediction) {
        ScanResult result = new ScanResult();
        result.setUrl(url);
        result.setUserId(userId);  // ✅ matches Long type in entity
        result.setConfidenceScore(confidenceScore);
        result.setIsPhishing(isPhishing);
        result.setPrediction(prediction);
        result.setScannedAt(LocalDateTime.now()); // ✅ fixed Date → LocalDateTime

        return scanRepository.save(result);
    }

    // ✅ userId should also be Long here
    public List<ScanResult> getUserScanHistory(Long userId) {
        return scanRepository.findByUserIdOrderByScannedAtDesc(userId);
    }

    public ScanResult getLatestUserScan(Long userId) {
        List<ScanResult> results = scanRepository.findByUserIdOrderByScannedAtDesc(userId);
        return results.isEmpty() ? null : results.get(0);
    }

    // ✅ Match all method calls to Long userId
    public ScanResult scanUrl(String url, Long userId) {
    String prediction = mlService.predict(url);
    Double confidence = mlService.getConfidenceScore(url);
    Boolean isPhishing = !"Safe".equalsIgnoreCase(prediction);
    return saveScanResult(url, userId, confidence, isPhishing, prediction);
}

}
