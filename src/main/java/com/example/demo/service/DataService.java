package com.example.demo.service;

import com.example.demo.dto.ComponentDetailsDTO;
import com.example.demo.dto.ComponentDTO;
import com.example.demo.dto.MaskDTO;
import com.example.demo.dto.ElectricalspecsDTO;
import com.example.demo.dto.CdsfigsDTO;
import com.example.demo.dto.ComponentandMaskDTO;
import com.example.demo.entity.Component;
import com.example.demo.entity.ComponentsSteps;
import com.example.demo.entity.Steps;
import com.example.demo.entity.Mask;
import com.example.demo.entity.Electricalspecs;
import com.example.demo.entity.Cdsfigs;
import com.example.demo.repository.ComponentRepository;
import com.example.demo.repository.ComponentStepsRepository;
import com.example.demo.repository.StepsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Date;
import java.util.Collections;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DataService {
    
    @Autowired
    private ComponentRepository componentRepository;
    
    @Autowired
    private StepsRepository stepsRepository;
    
    @Autowired
    private ComponentStepsRepository componentStepsRepository;
    
    public List<Component> getAllComponents() {
        // Return all components for the base endpoint
        return componentRepository.findByComponentTechnologyId(324);
    }
    
    public List<Steps> getAllSteps() {
        return stepsRepository.findByStepTechnologyId(324);
    }
    
    public List<ComponentsSteps> getAllComponentSteps() {
        return componentStepsRepository.findByComponentNameAndTechnologyId("NCH_1V5_101", 340);
    }
    

    public List<Component> searchComponents(String searchTerm, Integer technologyId) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            // Return empty list only for empty search terms
            return Collections.emptyList();
        }
        try {
            if (technologyId != null) {
                // Search with technology filter
                List<Component> results = componentRepository.findByNameContainingAndTechnologyId(searchTerm, technologyId);
                System.out.println("Search term: " + searchTerm + ", Technology ID: " + technologyId + ", Results found: " + results.size());
                return results;
            } else {
                // Search without technology filter (existing functionality)
                List<Component> results = componentRepository.findByNameContainingIgnoreCase(searchTerm);
                System.out.println("Search term: " + searchTerm + ", Results found: " + results.size());
                return results;
            }
        } catch (Exception e) {
            System.err.println("Error searching components: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<ComponentDTO> getComponentDetails(String componentName) {
        List<Object[]> rawResults = componentRepository.findDetailedComponentInfo(componentName);
        return rawResults.stream()
                .map(result -> new ComponentDTO(
                    (Integer) result[0],  // id
                    (String) result[1],   // name
                    (String) result[2],   // description
                    (Integer) result[3],  // categoryId
                    (Integer) result[4],  // technologyId
                    (Integer) result[5],  // position
                    (Integer) result[6],  // lockVersion
                    (Integer) result[7],  // componentTypeId
                    (Integer) result[8],  // pcdTemplateId
                    (Integer) result[9],  // usageId
                    (String) result[10],  // active
                    (String) result[11],  // comments
                    (String) result[12],  // componentSvns
                    (Integer) result[13], // samePcdAsId
                    (Integer) result[14], // sameDrAsId
                    (String) result[15],  // cdsFigs
                    (String) result[16],  // ownerEmpId
                    (String) result[17],  // tags
                    (Date) result[18],    // createdDate
                    (Date) result[19]     // modifiedDate
                    ))
                .collect(Collectors.toList());
    }
    
    public List<ComponentandMaskDTO> getDetailedComponentData(String componentName) {
        List<Object[]> rawResults = componentRepository.findDetailedComponentInfoWithMask(componentName);
        return rawResults.stream()
                .map(result -> new ComponentandMaskDTO(
                    new ComponentDTO(
                        (Integer) result[0],  // id
                        (String) result[1],   // name
                        (String) result[2],   // description
                        (Integer) result[3],  // categoryId
                        (Integer) result[4],  // technologyId
                        (Integer) result[5],  // position
                        (Integer) result[6],  // lockVersion
                        (Integer) result[7],  // componentTypeId
                        (Integer) result[8],  // pcdTemplateId
                        (Integer) result[9],  // usageId
                        (String) result[10],  // active
                        (String) result[11],  // comments
                        (String) result[12],  // componentSvns
                        (Integer) result[13], // samePcdAsId
                        (Integer) result[14], // sameDrAsId
                        (String) result[15],  // cdsFigs
                        (String) result[16],  // ownerEmpId
                        (String) result[17],  // tags
                        (Date) result[18],    // createdDate
                        (Date) result[19]     // modifiedDate
                    ),
                    new MaskDTO(
                        (Integer) result[20], // maskid
                        (String) result[21],  // maskname
                        (String) result[22],  // maskdescription
                        (Integer) result[23], // maskdarkData
                        (Integer) result[24]  // masktechnologyId
                    )
                ))
                .collect(Collectors.toList());
    }

    public List<ComponentDetailsDTO> getComponentViewByNameAndTechnology(String componentName, Integer technologyId) {
        // Get components matching the exact name and technology ID
        List<Component> components = componentRepository.findByComponentNameAndTechnologyId(componentName, technologyId);
        System.out.println("Found " + components.size() + " components with name " + componentName + " and technology ID " + technologyId);
        return buildComponentDetailsDTOs(components);
    }

    public List<ComponentDetailsDTO> getComponentView(String componentName) {
        // First try exact match
        List<Component> components = componentRepository.findByExactComponentName(componentName);
        
        // If no exact match, try containing match
        if (components.isEmpty()) {
            components = componentRepository.findByComponentNameContaining(componentName);
        }
        
        System.out.println("Found " + components.size() + " components with name " + componentName);
        return buildComponentDetailsDTOs(components);
    }

    private List<ComponentDetailsDTO> buildComponentDetailsDTOs(List<Component> components) {
        List<ComponentDetailsDTO> result = new ArrayList<>();
        
        for (Component component : components) {
            // Create ComponentDTO
            ComponentDTO componentDTO = new ComponentDTO(
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
            );
            
            // Get mask data
            List<Mask> masks = componentRepository.findMasksByComponentId(component.getId());
            MaskDTO maskDTO = null;
            if (!masks.isEmpty()) {
                Mask mask = masks.get(0); // Just use the first mask if multiple exist
                maskDTO = new MaskDTO(
                    mask.getMaskid(),
                    mask.getMaskname(),
                    mask.getMaskdescription(),
                    mask.getMaskdarkData(),
                    mask.getMasktechnologyId()
                );
            }
            
            // Get electrical specs
            List<Electricalspecs> electricalSpecs = componentRepository.findElectricalSpecsByComponentId(component.getId());
            ElectricalspecsDTO electricalSpecsDTO = null;
            if (!electricalSpecs.isEmpty()) {
                Electricalspecs specs = electricalSpecs.get(0); // Just use the first one if multiple exist
                electricalSpecsDTO = new ElectricalspecsDTO(
                    specs.getId(),
                    specs.getSvn(),
                    specs.getFailCriteria(),
                    specs.getEtestName(),
                    specs.getDescription(),
                    specs.getTyp(),
                    specs.getMin(),
                    specs.getMax(),
                    specs.getUnits(),
                    specs.getComments(),
                    specs.getNotes(),
                    specs.getTechnologyId(),
                    specs.getPosition(),
                    specs.getCellRefs(),
                    specs.getLegacyWaivers(),
                    specs.getUpdatedAt(),
                    specs.getCommentsNew(),
                    specs.getUpdatedBy(),
                    specs.getComponentId()
                );
            }
            
            // Get CDS figs
            List<Cdsfigs> cdsFigs = componentRepository.findCdsFigsByComponentId(component.getId());
            CdsfigsDTO cdsfigsDTO = null;
            if (!cdsFigs.isEmpty()) {
                Cdsfigs figs = cdsFigs.get(0); // Just use the first one if multiple exist
                cdsfigsDTO = new CdsfigsDTO(
                    figs.getId(),
                    figs.getTech(),
                    figs.getFigName(),
                    figs.getFigVersion(),
                    figs.getPlaUrl(),
                    figs.getMskUrl(),
                    figs.getLayoutUrl(),
                    figs.getMsectUrl(),
                    figs.getXsectUrl(),
                    figs.getCdsLibName(),
                    figs.getCdsCellName(),
                    figs.getCdsViewName(),
                    figs.getComponentId(),
                    figs.getTechnologyId()
                );
            }
            
            // Create and add the ComponentDetailsDTO
            result.add(new ComponentDetailsDTO(componentDTO, maskDTO, electricalSpecsDTO, cdsfigsDTO));
        }
        
        return result;
    }

    public List<Map<String, Object>> getAllUniqueTechnologies() {
        List<Object[]> results = componentRepository.findAllUniqueTechnologies();
        List<Map<String, Object>> technologies = new ArrayList<>();
        
        for (Object[] result : results) {
            Map<String, Object> tech = new HashMap<>();
            tech.put("id", result[0]);
            tech.put("name", result[1]);
            technologies.add(tech);
        }
        
        return technologies;
    }
}


