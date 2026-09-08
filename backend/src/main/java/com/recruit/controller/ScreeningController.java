package com.recruit.controller;

import com.recruit.dto.EvaluationDto;
import com.recruit.service.ScreeningService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/screening")
@RequiredArgsConstructor
public class ScreeningController {

    private final ScreeningService screeningService;

    @PostMapping("/run")
    public ResponseEntity<EvaluationDto> runScreening(@RequestParam Long resumeId) {
        return ResponseEntity.ok(screeningService.runScreening(resumeId));
    }
}
