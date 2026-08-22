package com.devfusion.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name="progress_history")
public class ProgressHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String stepName;

    private String status;


    public ProgressHistory(){

    }


    public ProgressHistory(Long userId,String stepName,String status){

        this.userId=userId;
        this.stepName=stepName;
        this.status=status;

    }


    public Long getId(){
        return id;
    }


    public Long getUserId(){
        return userId;
    }


    public String getStepName(){
        return stepName;
    }


    public String getStatus(){
        return status;
    }

}