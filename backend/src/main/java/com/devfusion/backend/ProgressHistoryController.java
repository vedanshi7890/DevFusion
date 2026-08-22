package com.devfusion.backend;

import com.devfusion.backend.model.ProgressHistory;
import com.devfusion.backend.repository.ProgressHistoryRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "http://localhost:5173")
public class ProgressHistoryController {

    private final ProgressHistoryRepository repository;

    public ProgressHistoryController(ProgressHistoryRepository repository){
        this.repository = repository;
    }

    @GetMapping("/{userId}")
    public List<ProgressHistory> getHistory(
            @PathVariable Long userId){

        return repository.findByUserId(userId);
    }


    @GetMapping("/clear/{userId}")
    public String clearHistory(@PathVariable Long userId){

        List<ProgressHistory> history =
                repository.findByUserId(userId);

        repository.deleteAll(history);

        return "History cleared";
    }
}