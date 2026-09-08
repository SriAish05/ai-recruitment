package com.recruit.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
public class AiClient {

    private final RestClient restClient;

    public AiClient(@Value("${app.aiservice.url}") String aiServiceUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(aiServiceUrl)
                .build();
    }

    public Map<String, Object> screenResume(String jobDescription, String resumeText) {
        try {
            return restClient.post()
                    .uri("/screen")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("job_description", jobDescription,
                                 "resume_text", resumeText))
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("AI service unavailable: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> runPipeline(String jobDescription, String resumeText) {
        try {
            return restClient.post()
                    .uri("/pipeline/run")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("job_description", jobDescription,
                                 "resume_text", resumeText))
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("AI service unavailable: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> evaluateInterview(String jobDescription,
                                                  String resumeText,
                                                  String transcript) {
        try {
            return restClient.post()
                    .uri("/evaluate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("job_description", jobDescription,
                                 "resume_text", resumeText,
                                 "interview_transcript", transcript))
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("AI service unavailable: " + e.getMessage(), e);
        }
    }
}
