package com.example.demo.entity;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Data
@Embeddable
public class ComponentsStepsId implements Serializable {

    @Column(name = "COMPONENT_ID")
    private Integer componentId;

    @Column(name = "STEP_ID")
    private Integer stepId;

    // Override equals and hashCode for proper functioning
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ComponentsStepsId that = (ComponentsStepsId) o;
        return Objects.equals(componentId, that.componentId) &&
               Objects.equals(stepId, that.stepId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(componentId, stepId);
    }
}
