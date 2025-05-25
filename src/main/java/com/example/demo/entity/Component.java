package com.example.demo.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Entity
@Data
@Table(name = "COMPONENTS")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Component {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "components_seq")
    @SequenceGenerator(name = "components_seq", sequenceName = "components_seq", allocationSize = 1)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "CATEGORY_ID")
    private Integer categoryId;

    @Column(name = "TECHNOLOGY_ID")
    private Integer technologyId;

    @Column(name = "POSITION")
    private Integer position;

    @Column(name = "LOCK_VERSION")
    private Integer lockVersion;

    @Column(name = "COMPONENT_TYPE_ID")
    private Integer componentTypeId;

    @Column(name = "PCD_TEMPLATE_ID")
    private Integer pcdTemplateId;

    @Column(name = "USAGE_ID")
    private Integer usageId;

    @Column(name = "ACTIVE")
    private String active;

    @Column(name = "COMMENTS")
    private String comments;

    @Column(name = "COMPONENT_SVNS")
    private String componentSvns;

    @Column(name = "SAME_PCD_AS_ID")
    private Integer samePcdAsId;

    @Column(name = "SAME_DR_AS_ID")
    private Integer sameDrAsId;

    @Column(name = "CDSFIGS")
    private String cdsFigs;

    @Column(name = "OWNER_EMPID")
    private String ownerEmpId;

    @Column(name = "TAGS")
    private String tags;

    @Column(name = "CREATED_AT")
    private Date createdAt;

    @Column(name = "UPDATED_AT")
    private Date updatedAt;

    // Explicitly exclude these collections from JSON serialization
    @JsonIgnore
    @OneToMany(mappedBy = "component", fetch = FetchType.LAZY)
    private List<ComponentsSteps> componentsSteps;
    
    @JsonIgnore
    @OneToMany(mappedBy = "component", fetch = FetchType.LAZY)
    private List<Electricalspecs> electricalspecs;
    
    @JsonIgnore
    @OneToMany(mappedBy = "component", fetch = FetchType.LAZY)
    private List<Cdsfigs> cdsfigs;
}




