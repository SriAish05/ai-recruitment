package com.recruit.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "evaluations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Stage stage;

    private Double matchScore;

    @Enumerated(EnumType.STRING)
    private Recommendation recommendation;

    @Column(columnDefinition = "TEXT")
    private String rationale;

    @Column(columnDefinition = "LONGTEXT")
    private String questions;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private EvaluationStatus status = EvaluationStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
