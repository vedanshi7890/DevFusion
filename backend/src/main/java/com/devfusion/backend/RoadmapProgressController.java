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


    @GetMapping("/{userId}")
    public RoadmapProgress getRoadmap(@PathVariable Long userId) {

        return repository.findByUserId(userId)
                .orElseGet(() -> {

                    RoadmapProgress roadmap =
                            new RoadmapProgress(userId);

                    return repository.save(roadmap);
                });
    }



    @PutMapping("/{userId}")
    public RoadmapProgress updateRoadmap(
            @PathVariable Long userId,
            @RequestBody RoadmapProgress updatedRoadmap) {


        RoadmapProgress roadmap =
                repository.findByUserId(userId)
                .orElse(new RoadmapProgress(userId));


        roadmap.setCompletedSteps(
                updatedRoadmap.getCompletedSteps()
        );

        roadmap.setProgressPercentage(
                updatedRoadmap.getProgressPercentage()
        );


        String steps = updatedRoadmap.getCompletedSteps();


        // Step 1
        if(steps.contains("1")) {

            saveHistoryIfNotExists(
                    userId,
                    "REST Controllers"
            );

        } else {

            deleteHistory(
                    userId,
                    "REST Controllers"
            );
        }



        // Step 2
        if(steps.contains("2")) {

            saveHistoryIfNotExists(
                    userId,
                    "CRUD APIs"
            );

        } else {

            deleteHistory(
                    userId,
                    "CRUD APIs"
            );
        }



        // Step 3
        if(steps.contains("3")) {

            saveHistoryIfNotExists(
                    userId,
                    "MySQL Database"
            );

        } else {

            deleteHistory(
                    userId,
                    "MySQL Database"
            );
        }



        // Step 4
        if(steps.contains("4")) {

            saveHistoryIfNotExists(
                    userId,
                    "Spring Boot Security"
            );

        } else {

            deleteHistory(
                    userId,
                    "Spring Boot Security"
            );
        }



        // Step 5
        if(steps.contains("5")) {

            saveHistoryIfNotExists(
                    userId,
                    "Backend Deployment"
            );

        } else {

            deleteHistory(
                    userId,
                    "Backend Deployment"
            );
        }



        return repository.save(roadmap);
    }





    private void deleteHistory(
            Long userId,
            String stepName
    ) {


        List<ProgressHistory> history =
                historyRepository.findByUserId(userId);


        history.stream()
                .filter(item ->
                        item.getStepName()
                        .equals(stepName)
                )
                .forEach(item ->
                        historyRepository.delete(item)
                );
    }





    private void saveHistoryIfNotExists(
            Long userId,
            String stepName
    ) {


        boolean exists =
                historyRepository
                .findByUserId(userId)
                .stream()
                .anyMatch(history ->
                        history.getStepName()
                        .equals(stepName)
                );


        if(!exists) {

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