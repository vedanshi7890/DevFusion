package com.devfusion.backend;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendation")
@CrossOrigin(origins = {"http://localhost:5173"})
public class RecommendationController {


    @GetMapping("/{goal}")
    public String getRecommendation(@PathVariable String goal) {


        if(goal.equals("Backend Developer")) {

    return "Your improvement area is Spring Boot. "
    + "Focus on REST APIs, CRUD operations, "
    + "MySQL integration and Spring Security.";

}

        if(goal.equals("Frontend Developer")) {
            return "Improve React and UI development";
        }


        if(goal.equals("AI Engineer")) {
            return "Learn Machine Learning and Python";
        }


        return "Keep improving your programming skills";

    }
}