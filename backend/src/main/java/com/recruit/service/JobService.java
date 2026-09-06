package com.recruit.service;

import com.recruit.dto.JobDto;
import com.recruit.entity.Job;
import com.recruit.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;

    public JobDto createJob(JobDto dto) {
        Job job = Job.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .build();
        Job saved = jobRepository.save(job);
        dto.setId(saved.getId());
        return dto;
    }

    public List<JobDto> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public JobDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return toDto(job);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    private JobDto toDto(Job job) {
        return JobDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .build();
    }
}
