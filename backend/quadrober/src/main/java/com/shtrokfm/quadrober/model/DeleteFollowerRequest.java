package com.shtrokfm.quadrober.model;

import lombok.Getter;

@Getter
public class DeleteFollowerRequest {
  private String meetingId;
  private String followerId;
}
