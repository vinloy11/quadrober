package com.shtrokfm.quadrober.meeting;

import com.shtrokfm.quadrober.entity.Meeting;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MeetingService {

  public Meeting create(Meeting meeting) {
    // Проверить не участвует ли юзер в других встречах в это время
    // Проверить нет ли у него уже запланированной встречи
    // Проверить есть ли встреча в этот промежуток в ближайшем месте

    return null;
  }

  public Meeting delete(String meetingId) {
    return null;
  }

  public Meeting update(Meeting meeting) {
    return null;
  }

  public void addFollower(String meetingId, String followerId) {
    // Проверить не участвует ли юзер в других встречах в это время
    // Проверить нет ли у него уже запланированной встречи

  }

  public void deleteFollower(String meetingId, String followerId) {

  }

  public List<Meeting> getMeetings(String meetingId) {
    // Нужна пагинация
    // Ставить первыми те встречи, в которых участвует пользователь
    // Далее сортировка по дистанции от юзера
    return null;
  }

  public Meeting getById(String meetingId) {
    return null;
  }
}
