package com.shtrokfm.quadrober.meeting;

import com.shtrokfm.quadrober.entity.Meeting;
import com.shtrokfm.quadrober.model.AddFollowerRequest;
import com.shtrokfm.quadrober.model.DeleteFollowerRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/meetings")
@RequiredArgsConstructor
public class MeetingController {
  private final MeetingService meetingService;

  @GetMapping("/{meetingId}")
  public Meeting getMeeting(@PathVariable String meetingId) {
    return this.meetingService.getById(meetingId);
  }

  @PostMapping
  public List<Meeting> create(@RequestBody Meeting meeting) {
    return this.meetingService.create(meeting);
  }

  @PutMapping
  public Meeting update(@RequestBody Meeting meeting) {
    return this.meetingService.update(meeting);
  }

// Нужна пагинация
//  @GetMapping
//  public List<Meeting> getAll() {}

  @DeleteMapping
  public void delete(@RequestBody String meetingId) {
    this.meetingService.delete(meetingId);
  }

  @PostMapping("/followers")
  public void addFollower(@RequestBody AddFollowerRequest meeting) {
    this.meetingService.addFollower(meeting.getMeetingId(), meeting.getFollowerId());
  }

  @DeleteMapping("/followers")
  public void deleteFollower(@RequestBody DeleteFollowerRequest meeting) {
    this.meetingService.deleteFollower(meeting.getMeetingId(), meeting.getFollowerId());
  }
}
