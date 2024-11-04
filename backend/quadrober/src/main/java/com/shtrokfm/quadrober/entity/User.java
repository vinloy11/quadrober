package com.shtrokfm.quadrober.entity;

import com.shtrokfm.quadrober.model.SocialMediaLink;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
  @Id
  private String id;
  @NotBlank(message = "Name is mandatory")
  private String name;
  /**
   * Айди от телеграмма
   */
  @NotBlank(message = "Telegram is mandatory")
  @Indexed(unique = true)
  private String telegramId;
  /**
   * Дата рождения
   */
  private Instant dateBirthday;
  /**
   * Рассказ о себе
   */
  @Size(max = 550, message = "{validation.description.size.too_long}")
  private String bio;

  /**
   * Ссылки на социальные сети
   */
  private List<SocialMediaLink> socialMediaLinks;
}
