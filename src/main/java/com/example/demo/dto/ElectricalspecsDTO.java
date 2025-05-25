package com.example.demo.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ElectricalspecsDTO {
    private Integer id;
    private String svn;
    private String failCriteria;
    private String etestName;
    private String description;
    private String typ;
    private String min;
    private String max;
    private String units;
    private String comments;
    private String notes;
    private Integer technologyId;
    private Integer position;
    private String cellRefs;
    private String legacyWaivers;
    private Date updatedAt;
    private String commentsNew;
    private String updatedBy;
    private Integer componentId;

    // Constructor
    public ElectricalspecsDTO(Integer id, String svn, String failCriteria, String etestName, String description, String typ, String min, String max, String units, String comments, String notes, Integer technologyId, Integer position, String cellRefs, String legacyWaivers, Date updatedAt, String commentsNew, String updatedBy, Integer componentId) {
        this.id = id;
        this.svn = svn;
        this.failCriteria = failCriteria;
        this.etestName = etestName;
        this.description = description;
        this.typ = typ;
        this.min = min;
        this.max = max;
        this.units = units;
        this.comments = comments;
        this.notes = notes;
        this.technologyId = technologyId;
        this.position = position;
        this.cellRefs = cellRefs;
        this.legacyWaivers = legacyWaivers;
        this.updatedAt = updatedAt;
        this.commentsNew = commentsNew;
        this.updatedBy = updatedBy;
        this.componentId=componentId;
    }



}

