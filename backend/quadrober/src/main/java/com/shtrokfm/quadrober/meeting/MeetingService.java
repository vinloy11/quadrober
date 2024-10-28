package com.shtrokfm.quadrober.meeting;

import com.shtrokfm.quadrober.entity.Meeting;
import com.shtrokfm.quadrober.model.CreateMeetingResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MeetingService {
  private final MeetingRepository meetingRepository;

  /**
   * Создает новую встречу, если нет встреч поблизости в этот день
   * Иначе отправляет список встреч
   * @param meeting
   * @return
   */
  public CreateMeetingResponse create(Meeting meeting) {
    double[] pointCoordinates = meeting.getAddress().getPoint();
    double radiusInMeters = 1000.0;

    Instant meetingDateTime = meeting.getMeetingDateTime();

    // Устанавливаем начало и конец встречи;
    Instant startOfDay = meetingDateTime.atZone(ZoneId.of("UTC")).toLocalDate().atStartOfDay(ZoneId.of("UTC")).toInstant(); // Начало дня в UTC
    Instant endOfDay = startOfDay.plusSeconds(86400); // Конец дня (86400 секунд = 1 день)

    List<Meeting> nearMeetings = this.meetingRepository.findByLocationNearInCurrentDay(
      pointCoordinates[0],
      pointCoordinates[1],
      radiusInMeters,
      startOfDay,
      endOfDay
    );

    Optional<Meeting> newMeeting = Optional.empty();

    if (nearMeetings.isEmpty()) {
      newMeeting = Optional.of(this.meetingRepository.save(meeting));
    }

    // { id: 'string',  nearMeetings: Meeting[] }

    // Если список пустой, значит создали встречу
    return new CreateMeetingResponse(newMeeting.map(Meeting::getId).orElse(null), nearMeetings);
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
    // Прибавлять таймзону пользователя
    return null;
  }

  public Meeting getById(String meetingId) {
    return null;
  }
}
