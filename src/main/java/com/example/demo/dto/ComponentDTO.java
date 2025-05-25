package com.example.demo.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ComponentDTO {
    private Integer id;
    private String name;
    private String description;
    private Integer categoryId;
    private Integer technologyId;
    private Integer position;
    private Integer lockVersion;
    private Integer componentTypeId;
    private Integer pcdTemplateId;
    private Integer usageId;
    private String active;
    private String comments;
    private String componentSvns;
    private Integer samePcdAsId;
    private Integer sameDrAsId;
    private String cdsFigs;
    private String ownerEmpId;
    private String tags;
    private Date createdDate;
    private Date modifiedDate;

    // Constructor
    public ComponentDTO(Integer id, String name, String description, Integer categoryId, Integer technologyId,
                        Integer position, Integer lockVersion, Integer componentTypeId, Integer pcdTemplateId,
                        Integer usageId, String active, String comments, String componentSvns, Integer samePcdAsId,
                        Integer sameDrAsId, String cdsFigs, String ownerEmpId, String tags, Date createdDate,
                        Date modifiedDate) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.categoryId = categoryId;
        this.technologyId = technologyId;
        this.position = position;
        this.lockVersion = lockVersion;
        this.componentTypeId = componentTypeId;
        this.pcdTemplateId = pcdTemplateId;
        this.usageId = usageId;
        this.active = active;
        this.comments = comments;
        this.componentSvns = componentSvns;
        this.samePcdAsId = samePcdAsId;
        this.sameDrAsId = sameDrAsId;
        this.cdsFigs = cdsFigs;
        this.ownerEmpId = ownerEmpId;
        this.tags = tags;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
    }
}

