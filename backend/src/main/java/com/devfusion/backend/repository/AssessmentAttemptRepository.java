package com.devfusion.backend.repository;

import com.devfusion.backend.model.AssessmentAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentAttemptRepository
        extends JpaRepository<AssessmentAttempt, Long> {

    List<AssessmentAttempt> findByUserIdOrderByAttemptedAtDesc(Long userId);
}