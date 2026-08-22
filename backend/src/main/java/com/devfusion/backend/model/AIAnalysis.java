package com.devfusion.backend.model;

public class AIAnalysis {

    private int completedSteps;
    private int totalSteps;
    private String progress;
    private String level;
    private String strength;
    private String nextRecommendation;


    public AIAnalysis(
            int completedSteps,
            int totalSteps,
            String progress,
            String level,
            String strength,
            String nextRecommendation
    ){

        this.completedSteps = completedSteps;
        this.totalSteps = totalSteps;
        this.progress = progress;
        this.level = level;
        this.strength = strength;
        this.nextRecommendation = nextRecommendation;

    }


    public int getCompletedSteps(){
        return completedSteps;
    }


    public int getTotalSteps(){
        return totalSteps;
    }


    public String getProgress(){
        return progress;
    }


    public String getLevel(){
        return level;
    }


    public String getStrength(){
        return strength;
    }


    public String getNextRecommendation(){
        return nextRecommendation;
    }

}