package com.shtrokfm.quadrober.entity;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class User {
  @Id
  private String id;
  @NotBlank(message = "Name is mandatory")
  private String name;

  public User(String name) {
    this.name = name;
  }
}
