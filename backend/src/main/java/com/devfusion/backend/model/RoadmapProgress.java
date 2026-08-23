package com.devfusion.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "roadmap_progress",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "skill"})
    }
)
public class RoadmapProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String skill;

    @Column(nullable = false)
    private String completedSteps = "";

    @Column(nullable = false)
    private int progressPercentage;

    public RoadmapProgress() {
    }

    public RoadmapProgress(Long userId) {
        this.userId = userId;
    }

    public RoadmapProgress(Long userId, String skill) {
        this.userId = userId;
        this.skill = skill;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }

    public String getCompletedSteps() {
        return completedSteps;
    }

    public void setCompletedSteps(String completedSteps) {
        this.completedSteps = completedSteps;
    }

    public int getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(int progressPercentage) {
        this.progressPercentage = progressPercentage;
    }
}