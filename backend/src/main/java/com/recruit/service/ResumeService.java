package com.recruit.service;

import com.recruit.dto.ResumeDto;
import com.recruit.entity.Candidate;
import com.recruit.entity.Job;
import com.recruit.entity.Resume;
import com.recruit.repository.CandidateRepository;
import com.recruit.repository.JobRepository;
import com.recruit.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final CandidateRepository candidateRepository;
    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;
    private final PdfService pdfService;

    public ResumeDto uploadResume(MultipartFile file,
                                  String candidateName,
                                  String candidateEmail,
                                  Long jobId) {
        try {
            // 1. Extract text first — before transferTo() consumes the file
            String extractedText = pdfService.extractText(file);

            // 2. Save the file to uploads/ in the working directory
            Path uploadDir = Paths.get(System.getProperty("user.dir"), "uploads");
            Files.createDirectories(uploadDir);
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadDir.resolve(filename);
            file.transferTo(filePath);

            // 3. Find existing candidate by email, or create a new one
            Candidate candidate = candidateRepository.findByEmail(candidateEmail)
                    .orElseGet(() -> candidateRepository.save(
                            Candidate.builder()
                                    .name(candidateName)
                                    .email(candidateEmail)
                                    .build()
                    ));

            // 4. Load the job — fail fast if it doesn't exist
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Job not found"));

            // 5. Build and persist the Resume entity
            Resume resume = resumeRepository.save(
                    Resume.builder()
                            .candidate(candidate)
                            .job(job)
                            .rawText(extractedText)
                            .filePath(filePath.toString())
                            .build()
            );

            // 6. Build and return the DTO — entity stays inside this service
            String preview = extractedText.length() > 300
                    ? extractedText.substring(0, 300)
                    : extractedText;

            return ResumeDto.builder()
                    .resumeId(resume.getId())
                    .candidateId(candidate.getId())
                    .candidateEmail(candidateEmail)
                    .jobTitle(job.getTitle())
                    .extractedTextPreview(preview)
                    .build();

        } catch (IOException e) {
            throw new RuntimeException("Failed to process resume upload: " + e.getMessage(), e);
        }
    }
}
