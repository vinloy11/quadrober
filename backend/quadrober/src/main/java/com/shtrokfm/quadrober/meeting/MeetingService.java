package com.shtrokfm.quadrober.meeting;

import com.shtrokfm.quadrober.entity.Meeting;
import com.shtrokfm.quadrober.model.CreateMeetingResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

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
    List<Meeting> nearMeetings = this.findNearMeetings(meeting);

    Optional<Meeting> newMeeting = Optional.empty();

    if (nearMeetings.isEmpty()) {
      newMeeting = Optional.of(this.meetingRepository.save(meeting));
    }

    // { id: 'string',  nearMeetings: Meeting[] }
    // Если список пустой, значит создали встречу
    return new CreateMeetingResponse(newMeeting.map(Meeting::getId).orElse(null), nearMeetings);
  }

  private List<Meeting> findNearMeetings(Meeting meeting) {
    double[] pointCoordinates = meeting.getAddress().getPoint();
    double radiusInMeters = 1000.0;

    Instant meetingDateTime = meeting.getMeetingDateTime();

    // Устанавливаем начало и конец встречи;
    Instant startOfDay = meetingDateTime.atZone(ZoneId.of("UTC")).toLocalDate().atStartOfDay(ZoneId.of("UTC")).toInstant(); // Начало дня в UTC
    Instant endOfDay = startOfDay.plusSeconds(86400); // Конец дня (86400 секунд = 1 день)

    return this.meetingRepository.findByLocationNearInCurrentDay(
      pointCoordinates[0],
      pointCoordinates[1],
      radiusInMeters,
      startOfDay,
      endOfDay
    );
  }

  public Meeting delete(String meetingId) {
    return null;
  }

  public Meeting update(Meeting meeting) {
    // достаем нашу встречу
    Meeting matchMeeting = this.meetingRepository.findById(meeting.getId()).orElse(null);

    // Если встречи не нашлось, кидаем 404
    if (matchMeeting == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Не найдена встреча по данному идентификатору");
    }

    // Проверяем нет ли встреч в этом месте в это время
    List<Meeting> nearMeetings = this.findNearMeetings(meeting).stream().filter(nearMeeting ->
      !Objects.equals(meeting.getId(), nearMeeting.getId())).toList();

    if (!nearMeetings.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "В это время в этом месте уже запланирована другая встреча");
    }

    Meeting updatedMeeting = new Meeting(
      meeting.getId(),
      matchMeeting.getOwner(),
      matchMeeting.getFollowers(),
      meeting.getAddress(),
      meeting.getMeetingDateTime()
    );

    // Обновляем встречу
    return this.meetingRepository.save(updatedMeeting);
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
    Meeting meeting = this.meetingRepository.findById(meetingId).orElse(null);

    if (meeting == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    return meeting;
  }
}
