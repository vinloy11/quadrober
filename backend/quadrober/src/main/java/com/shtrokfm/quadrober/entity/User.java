package com.shtrokfm.quadrober.entity;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
  @Id
  private String id;
  @NotBlank(message = "Name is mandatory")
  private String name;
}
