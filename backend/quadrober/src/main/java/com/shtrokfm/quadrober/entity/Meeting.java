package com.shtrokfm.quadrober.entity;

import com.shtrokfm.quadrober.model.Address;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Meeting {
  @Id
  private String id;

  @NotNull
  @DBRef
  private User owner;

  @DBRef
  private List<User> followers;

  @NotNull
  private Address address;

  @NotNull
  private Instant meetingDateTime;
}
