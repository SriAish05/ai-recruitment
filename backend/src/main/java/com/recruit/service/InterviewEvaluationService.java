package com.recruit.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.recruit.config.AiClient;
import com.recruit.dto.EvaluationDto;
import com.recruit.entity.*;
import com.recruit.repository.CandidateRepository;
import com.recruit.repository.EvaluationRepository;
import com.recruit.repository.JobRepository;
import com.recruit.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InterviewEvaluationService {

    private final EvaluationMapper evaluationMapper;
    private final CandidateRepository candidateRepository;
    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;
    private final EvaluationRepository evaluationRepository;
    private final AiClient aiClient;
    private final ObjectMapper objectMapper;

    public EvaluationDto evaluate(Long candidateId, Long jobId, String transcript) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found: " + candidateId));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        List<Resume> resumes = resumeRepository.findByCandidateIdAndJobId(candidateId, jobId);
        if (resumes.isEmpty()) {
            throw new RuntimeException("No resume found for candidate and job");
        }
        Resume resume = resumes.get(resumes.size() - 1);

        Map<String, Object> aiResponse = aiClient.evaluateInterview(
                job.getDescription(),
                resume.getRawText(),
                transcript
        );

        Recommendation recommendation = Recommendation.valueOf(
                (String) aiResponse.get("recommendation"));
        String rationale = (String) aiResponse.get("rationale");

        @SuppressWarnings("unchecked")
        List<String> strengths = (List<String>) aiResponse.get("strengths");
        @SuppressWarnings("unchecked")
        List<String> concerns = (List<String>) aiResponse.get("concerns");

        String detailsJson;
        try {
            detailsJson = objectMapper.writeValueAsString(
                    Map.of("strengths", strengths, "concerns", concerns));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize evaluation details", e);
        }

        Evaluation saved = evaluationRepository.save(
                Evaluation.builder()
                        .candidate(candidate)
                        .job(job)
                        .stage(Stage.INTERVIEW)
                        .recommendation(recommendation)
                        .rationale(rationale)
                        .questions(detailsJson)
                        .build()
        );

        return evaluationMapper.toDto(saved);
    }
}
