package com.fintech.credit.service;

import com.fintech.credit.dto.BehavioralDataDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class MlIntegrationService {

    @Value("${ml.api.url}")
    private String mlApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> getCreditScore(BehavioralDataDTO extractedFeatures) throws Exception {
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(mlApiUrl, extractedFeatures, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                throw new Exception("ML API returned non-success code: " + response.getStatusCodeValue());
            }
        } catch (Exception e) {
            throw new Exception("Failed to communicate with ML Model Backend: " + e.getMessage());
        }
    }
}
