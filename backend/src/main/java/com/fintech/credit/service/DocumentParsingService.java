package com.fintech.credit.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;
import java.util.List;

@Service
public class DocumentParsingService {

    public String extractTextFromPdfs(List<MultipartFile> files) throws Exception {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("No files provided.");
        }
        
        StringBuilder combinedText = new StringBuilder();
        
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            
            try (InputStream is = file.getInputStream();
                 PDDocument document = PDDocument.load(is)) {
                 
                PDFTextStripper stripper = new PDFTextStripper();
                String text = stripper.getText(document);
                if (text != null && !text.trim().isEmpty()) {
                    combinedText.append(text).append("\n\n--- NEXT DOCUMENT ---\n\n");
                }
            }
        }
        
        if (combinedText.length() == 0) {
             throw new Exception("No text could be extracted from the provided PDFs.");
        }
        
        return combinedText.toString();
    }
}
