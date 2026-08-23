package com.devfusion.backend.repository;

import com.devfusion.backend.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findByUserId(Long userId);

    Optional<Skill> findByUserIdAndName(Long userId, String name);
}