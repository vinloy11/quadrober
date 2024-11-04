package com.shtrokfm.quadrober.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocialMediaLink {
  private String url;
  private String name;
//  TODO Возможно добавить тип социальной сети,
//   чтобы отображать красивее ссылки
//  private String type;
}
