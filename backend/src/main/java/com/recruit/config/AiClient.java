package com.recruit.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class AiClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public AiClient(@Value("${app.aiservice.url}") String aiServiceUrl) {
        this.restTemplate = new RestTemplate();
        this.baseUrl = aiServiceUrl;
    }

    private HttpEntity<Map<String, String>> jsonBody(Map<String, String> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(body, headers);
    }

    public Map<String, Object> screenResume(String jobDescription, String resumeText) {
        try {
            Map<String, String> body = new HashMap<>();
            body.put("job_description", jobDescription);
            body.put("resume_text", resumeText);
            return restTemplate.exchange(
                    baseUrl + "/screen", HttpMethod.POST,
                    jsonBody(body),
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            ).getBody();
        } catch (Exception e) {
            throw new RuntimeException("AI service unavailable: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> runPipeline(String jobDescription, String resumeText) {
        try {
            Map<String, String> body = new HashMap<>();
            body.put("job_description", jobDescription);
            body.put("resume_text", resumeText);
            return restTemplate.exchange(
                    baseUrl + "/pipeline/run", HttpMethod.POST,
                    jsonBody(body),
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            ).getBody();
        } catch (Exception e) {
            throw new RuntimeException("AI service unavailable: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> evaluateInterview(String jobDescription,
                                                  String resumeText,
                                                  String transcript) {
        try {
            Map<String, String> body = new HashMap<>();
            body.put("job_description", jobDescription);
            body.put("resume_text", resumeText);
            body.put("interview_transcript", transcript);
            return restTemplate.exchange(
                    baseUrl + "/evaluate", HttpMethod.POST,
                    jsonBody(body),
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            ).getBody();
        } catch (Exception e) {
            throw new RuntimeException("AI service unavailable: " + e.getMessage(), e);
        }
    }
}
