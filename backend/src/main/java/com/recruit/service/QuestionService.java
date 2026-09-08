package com.recruit.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.recruit.config.AiClient;
import com.recruit.dto.EvaluationDto;
import com.recruit.entity.Evaluation;
import com.recruit.entity.Stage;
import com.recruit.repository.EvaluationRepository;
import com.recruit.repository.ResumeRepository;
import com.recruit.entity.Resume;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final ResumeRepository resumeRepository;
    private final EvaluationRepository evaluationRepository;
    private final AiClient aiClient;
    private final ObjectMapper objectMapper;

    public EvaluationDto generateQuestions(Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found: " + resumeId));

        Map<String, Object> aiResponse = aiClient.runPipeline(
                resume.getJob().getDescription(),
                resume.getRawText()
        );

        String questionsJson;
        try {
            Map<String, Object> questionMap = Map.of(
                    "technical", aiResponse.get("technical"),
                    "behavioural", aiResponse.get("behavioural")
            );
            questionsJson = objectMapper.writeValueAsString(questionMap);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize questions", e);
        }

        List<Evaluation> screeningEvals = evaluationRepository
                .findByCandidateIdAndJobIdAndStage(
                        resume.getCandidate().getId(),
                        resume.getJob().getId(),
                        Stage.SCREENING);
        if (screeningEvals.isEmpty()) {
            throw new RuntimeException("No screening evaluation found");
        }
        Evaluation evaluation = screeningEvals.get(screeningEvals.size() - 1);

        evaluation.setQuestions(questionsJson);
        Evaluation saved = evaluationRepository.save(evaluation);

        return toDto(saved);
    }

    private EvaluationDto toDto(Evaluation e) {
        return EvaluationDto.builder()
                .id(e.getId())
                .candidateId(e.getCandidate().getId())
                .jobId(e.getJob().getId())
                .stage(e.getStage().name())
                .matchScore(e.getMatchScore())
                .recommendation(e.getRecommendation().name())
                .rationale(e.getRationale())
                .status(e.getStatus().name())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
