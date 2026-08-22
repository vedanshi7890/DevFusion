package com.devfusion.backend.repository;

import com.devfusion.backend.model.ProgressHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgressHistoryRepository 
extends JpaRepository<ProgressHistory, Long>{

    List<ProgressHistory> findByUserId(Long userId);

}