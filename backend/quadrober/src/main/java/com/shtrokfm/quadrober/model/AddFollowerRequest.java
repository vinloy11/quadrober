package com.shtrokfm.quadrober.model;

import lombok.Getter;

@Getter
public class AddFollowerRequest {
  private String meetingId;
  private String followerId;
}
