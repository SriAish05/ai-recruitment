package com.recruit.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PdfService {

    public String extractText(MultipartFile file) {
        PDDocument doc = null;
        try {
            doc = Loader.loadPDF(file.getBytes());
            return new PDFTextStripper().getText(doc);
        } catch (IOException e) {
            throw new RuntimeException("Failed to extract PDF text: " + e.getMessage(), e);
        } finally {
            if (doc != null) {
                try {
                    doc.close();
                } catch (IOException ignored) {
                }
            }
        }
    }
}
