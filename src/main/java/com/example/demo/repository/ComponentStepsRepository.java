package com.example.demo.repository;


import com.example.demo.entity.ComponentsSteps;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.ComponentsStepsId;

import java.util.List;


@Repository
public interface ComponentStepsRepository extends JpaRepository<ComponentsSteps, ComponentsStepsId> {
    @Query(value = "SELECT * FROM COMPONENTS JOIN COMPONENTS_STEPS ON COMPONENTS.ID = COMPONENTS_STEPS.COMPONENT_ID WHERE COMPONENTS.NAME = :componentName  AND COMPONENTS.TECHNOLOGY_ID = :technologyId", 
           nativeQuery = true)
    List<ComponentsSteps> findByComponentNameAndTechnologyId(
        @Param("componentName") String componentName,
        @Param("technologyId") Integer technologyId
    );

   
    
}
