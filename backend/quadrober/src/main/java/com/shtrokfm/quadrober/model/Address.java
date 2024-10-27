package com.shtrokfm.quadrober.model;

import lombok.Data;

@Data
public class Address {
  private double[] point;
  private String description;
  private String name;
}
