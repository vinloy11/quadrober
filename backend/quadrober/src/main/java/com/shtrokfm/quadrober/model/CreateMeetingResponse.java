package com.shtrokfm.quadrober.model;

import com.shtrokfm.quadrober.entity.Meeting;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateMeetingResponse {
  private String meetingId;
  private List<Meeting> nearMeetings;
}
