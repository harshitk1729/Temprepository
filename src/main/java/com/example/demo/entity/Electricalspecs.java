package com.example.demo.entity;

import java.util.Date;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Entity
@Data
@Table(name = "ELECTRICAL_SPECS")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Electricalspecs {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "electricalspecs_seq")
    @SequenceGenerator(name = "electricalspecs_seq", sequenceName = "electricalspecs_seq", allocationSize = 1)
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "ID")
    private Integer id;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "NAME")
    private String svn;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "FAIL_CRITERIA")
    private String failCriteria;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "ETEST_NAME")
    private String etestName;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "DESCRIPTION")
    private String description;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "TARGET")
    private String typ;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "LSL")
    private String min;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "USL")
    private String max;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "UNITS")
    private String units;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "COMMENTS")
    private String comments;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "NOTES")
    private String notes;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "TECHNOLOGY_ID")
    private Integer technologyId;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "POSITION")
    private Integer position;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "CELL_REFS")
    private String cellRefs;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "LEGACY_WAIVERS")
    private String legacyWaivers;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "UPDATED_AT")
    private Date updatedAt;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "COMMENTS_NEW")
    private String commentsNew;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "UPDATED_BY")
    private String updatedBy;
    
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "COMPONENT_ID")
    private Integer componentId;
    
    @JsonIgnoreProperties("electricalspecs")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COMPONENT_ID", insertable = false, updatable = false)
    private Component component;
}
