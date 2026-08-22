package com.devfusion.backend;


import com.devfusion.backend.model.AIAnalysis;
import com.devfusion.backend.model.RoadmapProgress;
import com.devfusion.backend.model.Skill;

import com.devfusion.backend.repository.RoadmapProgressRepository;
import com.devfusion.backend.repository.SkillRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "http://localhost:5173")
public class AIAnalysisController {


    private final RoadmapProgressRepository roadmapRepository;
    private final SkillRepository skillRepository;



    public AIAnalysisController(
            RoadmapProgressRepository roadmapRepository,
            SkillRepository skillRepository
    ){

        this.roadmapRepository = roadmapRepository;
        this.skillRepository = skillRepository;

    }



    @GetMapping("/{userId}")
    public AIAnalysis getAnalysis(
            @PathVariable Long userId
    ){


        RoadmapProgress roadmap =
                roadmapRepository.findByUserId(userId)
                .orElse(new RoadmapProgress(userId));



        String steps = roadmap.getCompletedSteps();



        int completed = 0;



        if(steps != null && !steps.isEmpty()){

            completed = steps.split(",").length;

        }



        int total = 5;



        int percentage =
                (completed * 100) / total;




        String level;



        if(percentage < 40){

            level = "Backend Learner";

        }
        else if(percentage < 80){

            level = "Intermediate Backend Developer";

        }
        else{

            level = "Backend Ready Developer";

        }




        // Skill Analysis

        List<Skill> skills =
                skillRepository.findAll();



        String strength = "No skill data";

        String weakSkill = "No skill data";



        if(!skills.isEmpty()){


            Skill strongest = skills.get(0);

            Skill weakest = skills.get(0);



            for(Skill skill : skills){


                if(skill.getScore() > strongest.getScore()){

                    strongest = skill;

                }



                if(skill.getScore() < weakest.getScore()){

                    weakest = skill;

                }

            }



            strength = strongest.getName();

            weakSkill = weakest.getName();


        }





        String recommendation;



        if(completed == 0){

            recommendation =
                    "Start with REST Controllers";

        }
        else if(completed == 1){

            recommendation =
                    "Complete CRUD APIs";

        }
        else if(completed == 2){

            recommendation =
                    "Learn MySQL Database Integration";

        }
        else if(completed == 3){

            recommendation =
                    "Focus on Spring Boot Security";

        }
        else if(completed == 4){

            recommendation =
                    "Deploy your backend application";

        }
        else{

            recommendation =
                    "All roadmap steps completed 🎉";

        }




        return new AIAnalysis(
                completed,
                total,
                percentage + "%",
                level,
                strength + " (Strong Skill) | Weak: " + weakSkill,
                recommendation
        );

    }

}