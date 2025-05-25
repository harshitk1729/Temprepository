package com.example.demo.dto;

import lombok.Data;

@Data
public class ComponentDetailsDTO {
    private ComponentDTO component;
    private MaskDTO mask;
    private ElectricalspecsDTO electricalSpecs; // Add ElectricalSpecsDTO
    private CdsfigsDTO cdsFigs;
                 // Add CdsFigsDTO


    // Constructor
    public ComponentDetailsDTO(ComponentDTO component, MaskDTO mask, ElectricalspecsDTO electricalSpecs, CdsfigsDTO cdsFigs) {
        this.component = component;
        this.mask = mask;
        this.electricalSpecs = electricalSpecs;
        this.cdsFigs = cdsFigs;
        
    }
}