package com.shtrokfm.quadrober.entity;

import com.shtrokfm.quadrober.model.GeocoderResponse;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class Meeting {
  @Id
  private String id;

  @NotNull
  @DBRef
  private User owner;

  @DBRef
  List<User> followers;

  @NotNull
  GeocoderResponse address;

  @NotNull
  Instant datetime;
}
