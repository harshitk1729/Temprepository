package com.example.demo.entity;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@Table(name = "STEPS")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "parentStep"})
public class Steps {

    @Id
    @Column(name = "ID")
    private Integer stepid;

    @Column(name = "NAME")
    private String stepname;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "POSITION")
    private Integer position;

    @Column(name = "MASK_ID")
    private Integer maskId;

    @Column(name = "PARENT_ID")
    private Integer parentId;

    @Column(name = "TECHNOLOGY_ID")
    private Integer technologyId;

    @Column(name = "CATEGORY_ID")
    private Integer categoryId;

 
}
