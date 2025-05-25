package com.example.demo.dto;
import lombok.Data;


@Data
public class ComponentandMaskDTO {
    private ComponentDTO component;
    private MaskDTO mask;

    public ComponentandMaskDTO(ComponentDTO component, MaskDTO mask) {
        this.component = component;
        this.mask = mask;
    }

    
    

}
