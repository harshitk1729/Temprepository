package com.example.demo.dto;

import lombok.Data;

@Data
public class CdsfigsDTO {
    private Integer id;
    private String tech;
    private String figName;
    private String figVersion;
    private String plaUrl;
    private String mskUrl;
    private String layoutUrl;
    private String msectUrl;
    private String xsectUrl;
    private String cdsLibName;
    private String cdsCellName;
    private String cdsViewName;
    private Integer componentId;
    private Integer technologyId;
    
    // Constructor
    public CdsfigsDTO(Integer id, String tech, String figName, String figVersion, String plaUrl, String mskUrl,String  layoutUrl, String msectUrl, String xsectUrl, String cdsLibName, String cdsCellName, String cdsViewName, Integer componentId, Integer technologyId) {
        this.id = id;
        this.tech = tech;
        this.figName = figName;
        this.figVersion = figVersion;
        this.plaUrl = plaUrl;
        this.mskUrl = mskUrl;
        this.layoutUrl = layoutUrl;
        this.msectUrl = msectUrl;
        this.xsectUrl = xsectUrl;
        this.cdsLibName = cdsLibName;
        this.cdsCellName = cdsCellName;
        this.cdsViewName = cdsViewName;
        this.componentId = componentId;
        this.technologyId = technologyId;
    }



}
