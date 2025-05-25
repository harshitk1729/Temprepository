package com.example.demo.dto;

import lombok.Data;

@Data
public class MaskDTO {
    private Integer maskid;
    private String maskname;
    private String maskdescription;
    private Integer maskdarkData;
    private Integer masktechnologyId;

    // Constructor
    public MaskDTO(Integer maskid, String maskname, String maskdescription, Integer maskdarkData, Integer masktechnologyId) {
        this.maskid = maskid;
        this.maskname = maskname;
        this.maskdescription = maskdescription;
        this.maskdarkData = maskdarkData;
        this.masktechnologyId = masktechnologyId;
    }
}
