package com.recruit.controller;

import com.recruit.dto.EvaluationDto;
import com.recruit.repository.EvaluationRepository;
import com.recruit.service.EvaluationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationRepository evaluationRepository;
    private final EvaluationMapper evaluationMapper;

    @GetMapping("/recent")
    public ResponseEntity<List<EvaluationDto>> getRecent(
            @RequestParam(defaultValue = "5") int limit) {
        List<EvaluationDto> recent = evaluationRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .limit(Math.max(1, limit))
                .map(evaluationMapper::toDto)
                .toList();
        return ResponseEntity.ok(recent);
    }
}
