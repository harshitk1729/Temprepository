package com.example.demo.entity;

import lombok.Data;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Table(name = "CDSFIGS")
public class Cdsfigs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", nullable = false)
    private Integer id;

    @Column(name = "TECH", length = 16)
    private String tech;

    @Column(name = "FIGNAME", length = 64)
    private String figName;

    @Column(name = "FIGVERSION", length = 32)
    private String figVersion;

    @Column(name = "PLA_URL", length = 512)
    private String plaUrl;

    @Column(name = "MSK_URL", length = 512)
    private String mskUrl;

    @Column(name = "LAYOUT_URL", length = 512)
    private String layoutUrl;

    @Column(name = "MSECT_URL", length = 512)
    private String msectUrl;

    @Column(name = "XSECT_URL", length = 512)
    private String xsectUrl;

    @Column(name = "CDS_LIBNAME", length = 64)
    private String cdsLibName;

    @Column(name = "CDS_CELLNAME", length = 64)
    private String cdsCellName;

    @Column(name = "CDS_VIEWNAME", length = 64)
    private String cdsViewName;

    @Column(name = "COMPONENT_ID")
    private Integer componentId;

    @Column(name = "TECHNOLOGY_ID")
    private Integer technologyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COMPONENT_ID", insertable = false, updatable = false)
    @JsonIgnoreProperties({"cdsfigs", "electricalspecs", "componentsSteps"})
    private Component component;
}
