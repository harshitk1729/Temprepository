package com.example.demo.entity;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Entity
@Data
@Table(name = "COMPONENTS_STEPS")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ComponentsSteps {

    @EmbeddedId
    private ComponentsStepsId id;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("componentId")
    @JoinColumn(name = "COMPONENT_ID")
    private Component component;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("stepId")
    @JoinColumn(name = "STEP_ID")
    private Steps step;

    // Additional fields (if any) can go here
}
