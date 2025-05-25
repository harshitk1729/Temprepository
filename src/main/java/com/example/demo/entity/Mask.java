package com.example.demo.entity;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;



@Entity
@Data
@Table(name = "MASKS")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Mask {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "masks_seq")
    @SequenceGenerator(name = "masks_seq", sequenceName = "masks_seq", allocationSize = 1)

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "ID")
    private Integer maskid;

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "NAME")
    private String maskname;

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "DESCRIPTION")
    private String maskdescription;

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "DARK_DATA")
    private Integer maskdarkData;


    @Column(name = "TECHNOLOGY_ID", nullable = false)
    private Integer masktechnologyId;


   

   
}
