package com.example.demo.controller;

import com.example.demo.dto.ComponentDetailsDTO;
import com.example.demo.dto.ComponentandMaskDTO;
import com.example.demo.dto.ComponentDTO;
import com.example.demo.entity.Component;
import com.example.demo.entity.ComponentsSteps;
import com.example.demo.entity.Steps;
import com.example.demo.service.DataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DataController {

    @Autowired
    private DataService dataService;

    @GetMapping("/components")
    public List<Component> getComponents() {
        return dataService.getAllComponents();
    }

    @GetMapping("/steps")
    public List<Steps> getSteps() {
        return dataService.getAllSteps();
    }

    @GetMapping("/components-steps")
    public List<ComponentsSteps> getComponentSteps() {
        return dataService.getAllComponentSteps();
    }

    @GetMapping("/components/search")
    public List<ComponentDTO> searchComponents(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) Integer technologyId
    ) {
        List<Component> components = dataService.searchComponents(name, technologyId);
        return components.stream()
            .map(component -> new ComponentDTO(
                component.getId(),
                component.getName(),
                component.getDescription(),
                component.getCategoryId(),
                component.getTechnologyId(),
                component.getPosition(),
                component.getLockVersion(),
                component.getComponentTypeId(),
                component.getPcdTemplateId(),
                component.getUsageId(),
                component.getActive(),
                component.getComments(),
                component.getComponentSvns(),
                component.getSamePcdAsId(),
                component.getSameDrAsId(),
                component.getCdsFigs(),
                component.getOwnerEmpId(),
                component.getTags(),
                component.getCreatedAt(),
                component.getUpdatedAt()
            ))
            .collect(Collectors.toList());
    }
    @GetMapping("/components/details")
    public List<ComponentDTO> getComponentDetails(@RequestParam String name) {
        return dataService.getComponentDetails(name);
    }
    @GetMapping("/components/withmask")
    public List<ComponentandMaskDTO> getComponentAndMaskData(@RequestParam String name) {
        return dataService.getDetailedComponentData(name);
    }
    @GetMapping("/components/view")
    public ResponseEntity<List<ComponentDetailsDTO>> getComponentView(
        @RequestParam String name,
        @RequestParam(required = false) Integer technologyId
    ) {
        try {
            List<ComponentDetailsDTO> components;
            
            if (technologyId != null) {
                // If technology ID is provided with name, use both for precise lookup
                components = dataService.getComponentViewByNameAndTechnology(name, technologyId);
                System.out.println("Looking up component by name: " + name + " and technology ID: " + technologyId);
            } else {
                // Otherwise just use the name
                components = dataService.getComponentView(name);
                System.out.println("Looking up component by name only: " + name);
            }
            
            System.out.println("Found " + components.size() + " components");
            return ResponseEntity.ok(components);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/technologies")
    public ResponseEntity<List<Map<String, Object>>> getAllTechnologies() {
        try {
            List<Map<String, Object>> technologies = dataService.getAllUniqueTechnologies();
            return ResponseEntity.ok(technologies);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    

    
}





