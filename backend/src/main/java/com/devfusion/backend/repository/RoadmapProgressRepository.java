package com.devfusion.backend.repository;

import com.devfusion.backend.model.RoadmapProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoadmapProgressRepository
        extends JpaRepository<RoadmapProgress, Long> {

    Optional<RoadmapProgress> findByUserIdAndSkill(
            Long userId,
            String skill
    );

    List<RoadmapProgress> findByUserId(Long userId);
}