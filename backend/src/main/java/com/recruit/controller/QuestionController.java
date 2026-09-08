package com.recruit.controller;

import com.recruit.dto.EvaluationDto;
import com.recruit.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/generate")
    public ResponseEntity<EvaluationDto> generateQuestions(@RequestParam Long resumeId) {
        return ResponseEntity.ok(questionService.generateQuestions(resumeId));
    }
}
