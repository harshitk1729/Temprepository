package com.example.demo.repository;


import com.example.demo.entity.Steps;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;



@Repository
public interface StepsRepository extends JpaRepository<Steps, Integer> {
    @Query(value = "SELECT * FROM STEPS where STEPS.TECHNOLOGY_ID = :technologyId", 
           nativeQuery = true)
    List<Steps> findByStepTechnologyId(
        
        @Param("technologyId") Integer technologyId
    );
}
