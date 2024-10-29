package com.shtrokfm.quadrober.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class Address {
  @NotNull
  @Size(min = 2, max = 2)
  private double[] point;
  @NotBlank
  private String description;
  @NotBlank
  private String name;
}
