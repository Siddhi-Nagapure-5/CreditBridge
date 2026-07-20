package com.fintech.credit.controller;

import com.fintech.credit.dto.BehavioralDataDTO;
import com.fintech.credit.service.DocumentParsingService;
import com.fintech.credit.service.GeminiIntegrationService;
import com.fintech.credit.service.MlIntegrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statements")
@CrossOrigin(origins = "*") // Typically configure this globally, but doing this here for prototype flexibility
public class StatementUploadController {

    @Autowired
    private DocumentParsingService documentParsingService;

    @Autowired
    private GeminiIntegrationService geminiIntegrationService;

    @Autowired
    private MlIntegrationService mlIntegrationService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> handleFileUpload(@RequestParam("statements") List<MultipartFile> files) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Step 1: Parse PDF to Text across all files
            String pdfText = documentParsingService.extractTextFromPdfs(files);

            // Step 2: Use Gemini to extract structural features
            BehavioralDataDTO metrics = geminiIntegrationService.extractBankStatementMetrics(pdfText);

            // Step 3: Forward the metrics to ML engine
            Map<String, Object> mlResult = mlIntegrationService.getCreditScore(metrics);

            response.put("parsed_data", metrics);
            response.put("credit_analysis", mlResult);
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "Statement processing failed.");
            response.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
