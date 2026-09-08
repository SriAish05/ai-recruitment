package com.recruit.controller;

import com.recruit.dto.EvaluationDto;
import com.recruit.dto.InterviewEvaluationRequest;
import com.recruit.service.InterviewEvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/interview")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewEvaluationService interviewEvaluationService;

    @PostMapping("/evaluate")
    public ResponseEntity<EvaluationDto> evaluate(
            @RequestBody InterviewEvaluationRequest request) {
        return ResponseEntity.ok(
                interviewEvaluationService.evaluate(
                        request.getCandidateId(),
                        request.getJobId(),
                        request.getTranscript()
                )
        );
    }
}
