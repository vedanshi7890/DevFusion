package com.devfusion.backend;

import com.devfusion.backend.model.AssessmentAttempt;
import com.devfusion.backend.repository.AssessmentAttemptRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessment-history")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class AssessmentAttemptController {

    private final AssessmentAttemptRepository assessmentAttemptRepository;

    public AssessmentAttemptController(
            AssessmentAttemptRepository assessmentAttemptRepository) {

        this.assessmentAttemptRepository = assessmentAttemptRepository;
    }

    @GetMapping("/{userId}")
    public List<AssessmentAttempt> getAssessmentHistory(
            @PathVariable Long userId) {

        return assessmentAttemptRepository
                .findByUserIdOrderByAttemptedAtDesc(userId);
    }
}