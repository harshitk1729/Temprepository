package com.example.demo.repository;

import com.example.demo.entity.Component;
import com.example.demo.entity.Mask;
import com.example.demo.entity.Steps;
import com.example.demo.entity.ComponentsSteps;
import com.example.demo.entity.Electricalspecs;
import com.example.demo.entity.Cdsfigs;

import com.example.demo.dto.ComponentDetailsDTO;
import com.example.demo.dto.ComponentDTO;
import com.example.demo.dto.MaskDTO;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface ComponentRepository extends JpaRepository<Component, Integer> {
    
    @Query("SELECT c FROM Component c WHERE c.technologyId = :technologyId")
    List<Component> findByComponentTechnologyId(@Param("technologyId") Integer technologyId);

    @Query("SELECT c FROM Component c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Component> findByNameContainingIgnoreCase(@Param("searchTerm") String searchTerm);

    @Query("SELECT " +
       "c.id, " +                  // 0
       "c.name, " +                // 1
       "c.description, " +         // 2
       "c.categoryId, " +          // 3
       "c.technologyId, " +        // 4
       "c.position, " +            // 5
       "c.lockVersion, " +         // 6
       "c.componentTypeId, " +     // 7
       "c.pcdTemplateId, " +       // 8
       "c.usageId, " +             // 9
       "c.active, " +              // 10
       "c.comments, " +            // 11
       "c.componentSvns, " +       // 12
       "c.samePcdAsId, " +         // 13
       "c.sameDrAsId, " +          // 14
       "c.cdsFigs, " +             // 15
       "c.ownerEmpId, " +          // 16
       "c.tags, " +                // 17
       "c.createdAt, " +           // 18
       "c.updatedAt " +            // 19
       "FROM Component c " +
       "WHERE LOWER(c.name) LIKE  LOWER(CONCAT('%',:componentName,'%')) ")
    
List<Object[]> findDetailedComponentInfo(@Param("componentName") String componentName);

@Query("SELECT " +
       "c.id, " +                  // 0
       "c.name, " +                // 1
       "c.description, " +         // 2
       "c.categoryId, " +          // 3
       "c.technologyId, " +        // 4
       "c.position, " +            // 5
       "c.lockVersion, " +         // 6
       "c.componentTypeId, " +     // 7
       "c.pcdTemplateId, " +       // 8
       "c.usageId, " +             // 9
       "c.active, " +              // 10
       "c.comments, " +            // 11
       "c.componentSvns, " +       // 12
       "c.samePcdAsId, " +         // 13
       "c.sameDrAsId, " +          // 14
       "c.cdsFigs, " +             // 15
       "c.ownerEmpId, " +          // 16
       "c.tags, " +                // 17
       "c.createdAt, " +           // 18
       "c.updatedAt, " +           // 19
       "m.maskid, " +              // 20
       "m.maskname, " +            // 21
       "m.maskdescription, " +     // 22
       "m.maskdarkData, " +        // 23
       "m.masktechnologyId " +     // 24
       "FROM Component c " +
       "JOIN ComponentsSteps cs ON c.id = cs.id.componentId " +
       "JOIN Steps s ON cs.id.stepId = s.stepid " +
       "JOIN Mask m ON s.maskId = m.maskid " +
       "WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :componentName, '%')) ")
List<Object[]> findDetailedComponentInfoWithMask(@Param("componentName") String componentName);

@Query("SELECT c.id, c.name, c.description FROM Component c WHERE c.name = :name")
List<Object[]> findComponentByName(@Param("name") String name);

@Query("SELECT " +
       "c.id, " +                  // 0
       "c.name, " +                // 1
       "c.description, " +         // 2
       "c.categoryId, " +          // 3
       "c.technologyId, " +        // 4
       "c.position, " +            // 5
       "c.lockVersion, " +         // 6
       "c.componentTypeId, " +     // 7
       "c.pcdTemplateId, " +       // 8
       "c.usageId, " +             // 9
       "c.active, " +              // 10
       "c.comments, " +            // 11
       "c.componentSvns, " +       // 12
       "c.samePcdAsId, " +         // 13
       "c.sameDrAsId, " +          // 14
       "c.cdsFigs, " +             // 15
       "c.ownerEmpId, " +          // 16
       "c.tags, " +                // 17
       "c.createdAt, " +           // 18
       "c.updatedAt, " +           // 19
       "m.maskid, " +              // 20
       "m.maskname, " +            // 21
       "m.maskdescription, " +     // 22
       "m.maskdarkData, " +        // 23
       "m.masktechnologyId, " +    // 24
       "e.id, " +                  // 25
       "e.svn, " +                 // 26
       "e.failCriteria, " +        // 27
       "e.etestName, " +           // 28
       "e.description, " +         // 29
       "e.typ, " +                 // 30
       "e.min, " +                 // 31
       "e.max, " +                 // 32
       "e.units, " +               // 33
       "e.comments, " +            // 34
       "e.notes, " +               // 35
       "e.technologyId, " +        // 36
       "e.position, " +            // 37
       "e.cellRefs, " +            // 38
       "e.legacyWaivers, " +       // 39
       "e.updatedAt, " +           // 40
       "e.commentsNew, " +         // 41
       "e.updatedBy, " +           // 42
       "e.componentId, " +         // 43
       "cds.id, " +                // 44
       "cds.tech, " +              // 45
       "cds.figName, " +           // 46
       "cds.figVersion, " +        // 47
       "cds.plaUrl, " +            // 48
       "cds.mskUrl, " +            // 49
       "cds.layoutUrl, " +         // 50
       "cds.msectUrl, " +          // 51
       "cds.xsectUrl, " +          // 52
       "cds.cdsLibName, " +        // 53
       "cds.cdsCellName, " +       // 54
       "cds.cdsViewName, " +       // 55
       "cds.componentId, " +       // 56
       "cds.technologyId " +       // 57
       "FROM Component c " +
       "LEFT JOIN ComponentsSteps cs ON c.id = cs.id.componentId " +
       "LEFT JOIN Steps s ON cs.id.stepId = s.stepid " +
       "LEFT JOIN Mask m ON s.maskId = m.maskid " +
       "LEFT JOIN Electricalspecs e ON c.id = e.componentId " +
       "LEFT JOIN Cdsfigs cds ON c.id = cds.componentId " +
       "WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :componentName, '%')) ")
List<Object[]> findComponetView(@Param("componentName") String componentName);

// Simple query to find components by name
@Query("SELECT c FROM Component c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :componentName, '%'))")
List<Component> findByComponentNameContaining(@Param("componentName") String componentName);

// Query to find mask data for a component
@Query("SELECT m FROM Mask m JOIN Steps s ON m.maskid = s.maskId " +
       "JOIN ComponentsSteps cs ON s.stepid = cs.id.stepId " +
       "WHERE cs.id.componentId = :componentId")
List<Mask> findMasksByComponentId(@Param("componentId") Integer componentId);

// Query to find electrical specs for a component
@Query("SELECT e FROM Electricalspecs e WHERE e.componentId = :componentId")
List<Electricalspecs> findElectricalSpecsByComponentId(@Param("componentId") Integer componentId);

// Query to find CDS figs for a component
@Query("SELECT c FROM Cdsfigs c WHERE c.componentId = :componentId")
List<Cdsfigs> findCdsFigsByComponentId(@Param("componentId") Integer componentId);

// Add this query to get all unique technologies
@Query("SELECT DISTINCT c.technologyId, t.name FROM Component c JOIN Technology t ON c.technologyId = t.id ORDER BY t.name")
List<Object[]> findAllUniqueTechnologies();

// Add this query to search by name and technology ID
@Query("SELECT c FROM Component c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND c.technologyId = :technologyId")
List<Component> findByNameContainingAndTechnologyId(@Param("searchTerm") String searchTerm, @Param("technologyId") Integer technologyId);

// This method should find components with exact name match and technology ID
@Query("SELECT c FROM Component c WHERE LOWER(c.name) = LOWER(:name) AND c.technologyId = :technologyId")
List<Component> findByComponentNameAndTechnologyId(@Param("name") String name, @Param("technologyId") Integer technologyId);

// This method should find components with exact name match
@Query("SELECT c FROM Component c WHERE LOWER(c.name) = LOWER(:name)")
List<Component> findByExactComponentName(@Param("name") String name);
}




