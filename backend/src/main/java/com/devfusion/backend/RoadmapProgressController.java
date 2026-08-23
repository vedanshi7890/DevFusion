package com.devfusion.backend;

import java.util.List;

import com.devfusion.backend.model.RoadmapProgress;
import com.devfusion.backend.repository.RoadmapProgressRepository;
import com.devfusion.backend.model.ProgressHistory;
import com.devfusion.backend.repository.ProgressHistoryRepository;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roadmap")
@CrossOrigin(origins = "http://localhost:5173")
public class RoadmapProgressController {

    private final RoadmapProgressRepository repository;
    private final ProgressHistoryRepository historyRepository;

    public RoadmapProgressController(
            RoadmapProgressRepository repository,
            ProgressHistoryRepository historyRepository) {

        this.repository = repository;
        this.historyRepository = historyRepository;
    }

    @GetMapping("/{userId}/{skill}")
    public RoadmapProgress getRoadmap(
            @PathVariable Long userId,
            @PathVariable String skill) {

        return repository.findByUserIdAndSkill(userId, skill)
                .orElseGet(() -> {

                    RoadmapProgress roadmap =
                            new RoadmapProgress(userId, skill);

                    return repository.save(roadmap);
                });
    }

    @PutMapping("/{userId}/{skill}")
    public RoadmapProgress updateRoadmap(
            @PathVariable Long userId,
            @PathVariable String skill,
            @RequestBody RoadmapProgress updatedRoadmap) {

        RoadmapProgress roadmap =
                repository.findByUserIdAndSkill(userId, skill)
                        .orElse(new RoadmapProgress(userId, skill));

        roadmap.setCompletedSteps(
                updatedRoadmap.getCompletedSteps()
        );

        roadmap.setProgressPercentage(
                updatedRoadmap.getProgressPercentage()
        );

        String steps = updatedRoadmap.getCompletedSteps();

        updateHistory(userId, skill, steps);

        return repository.save(roadmap);
    }

    private void updateHistory(
            Long userId,
            String skill,
            String steps) {

        for (int i = 1; i <= 5; i++) {

            String stepName = getStepName(skill, i);

            if (stepName == null) {
                continue;
            }

            if (steps.contains(String.valueOf(i))) {

                saveHistoryIfNotExists(
                        userId,
                        stepName
                );

            } else {

                deleteHistory(
                        userId,
                        stepName
                );
            }
        }
    }

    private String getStepName(
            String skill,
            int step) {

        if (skill.equals("Java")) {

            if (step == 1) {
                return "OOP Concepts";
            }

            if (step == 2) {
                return "Java Collections";
            }

            if (step == 3) {
                return "Exception Handling";
            }

            if (step == 4) {
                return "Multithreading";
            }

            if (step == 5) {
                return "Advanced Java";
            }
        }

        if (skill.equals("React")) {

            if (step == 1) {
                return "React Components";
            }

            if (step == 2) {
                return "State Management & Hooks";
            }

            if (step == 3) {
                return "API Integration";
            }

            if (step == 4) {
                return "React Routing";
            }

            if (step == 5) {
                return "Modern React Patterns";
            }
        }

        if (skill.equals("SQL")) {

            if (step == 1) {
                return "SQL Fundamentals";
            }

            if (step == 2) {
                return "SQL Joins";
            }

            if (step == 3) {
                return "Subqueries & Aggregation";
            }

            if (step == 4) {
                return "Indexing & Query Optimization";
            }

            if (step == 5) {
                return "Database Design";
            }
        }

        if (skill.equals("Spring Boot")) {

            if (step == 1) {
                return "REST Controllers";
            }

            if (step == 2) {
                return "CRUD APIs";
            }

            if (step == 3) {
                return "MySQL Database";
            }

            if (step == 4) {
                return "Spring Boot Security";
            }

            if (step == 5) {
                return "Backend Deployment";
            }
        }

        return null;
    }

    private void deleteHistory(
            Long userId,
            String stepName) {

        List<ProgressHistory> history =
                historyRepository.findByUserId(userId);

        history.stream()
                .filter(item ->
                        item.getStepName().equals(stepName)
                )
                .forEach(item ->
                        historyRepository.delete(item)
                );
    }

    private void saveHistoryIfNotExists(
            Long userId,
            String stepName) {

        boolean exists =
                historyRepository
                        .findByUserId(userId)
                        .stream()
                        .anyMatch(history ->
                                history.getStepName().equals(stepName)
                        );

        if (!exists) {

            historyRepository.save(
                    new ProgressHistory(
                            userId,
                            stepName,
                            "Completed"
                    )
            );
        }
    }
}