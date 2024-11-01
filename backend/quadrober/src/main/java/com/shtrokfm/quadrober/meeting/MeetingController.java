package com.shtrokfm.quadrober.meeting;

import com.shtrokfm.quadrober.entity.Meeting;
import com.shtrokfm.quadrober.model.AddFollowerRequest;
import com.shtrokfm.quadrober.model.CreateMeetingResponse;
import com.shtrokfm.quadrober.model.DeleteFollowerRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * Контроллер для CRUD операций над встречами
 */
@RestController
@RequestMapping("/meetings")
@RequiredArgsConstructor
public class MeetingController {
  private final MeetingService meetingService;

  /**
   * Получить встречу по айди
   * @param meetingId
   * @return
   */
  @GetMapping("/{meetingId}")
  public Meeting getMeeting(@PathVariable String meetingId) {
    return this.meetingService.getById(meetingId);
  }

  /**
   * Создание встречи
   *
   * @param meeting
   * @return
   */
  @PostMapping
  public CreateMeetingResponse create(@RequestBody Meeting meeting) {
    return this.meetingService.create(meeting);
  }

  /**
   * Редактирование встречи
   * @param meeting
   * @return
   */
  @PutMapping
  public Meeting update(@RequestBody Meeting meeting) {
    return this.meetingService.update(meeting);
  }

  /**
   * Получить встречи пользователя
   * @return
   */
  @GetMapping("/my-meetings")
  public List<Meeting> getMyMeetings() {
    return this.meetingService.getMyMeetings();
  }

  /**
   * Получить список встреч по параметрам
   * @param coordinates
   * @param date
   * @return
   */
  @GetMapping("/")
  public List<Meeting> getNearMeetings(
    @RequestParam("coordinates") Optional<String> coordinates,
    @RequestParam(value = "date", required = false) Optional<String> date
  ) {
    if (coordinates.isEmpty()) {
      return new ArrayList<>();
    }

    double[] preparedCoordinates;

    try {
      preparedCoordinates = Arrays.stream(coordinates.get().split(",")).mapToDouble(Double::parseDouble).toArray();
    } catch (RuntimeException e) {
      return new ArrayList<>();
    }

    if (preparedCoordinates.length != 2) {
      return new ArrayList<>();
    }

    Instant meetingDateTime = null;

    if (date.isPresent()) {
      try {
        // Преобразуем строку в Instant
        meetingDateTime = Instant.parse(date.get());
      } catch (DateTimeParseException e) {
        // Обработка ошибки, если строка не соответствует формату
        // Можно вернуть пустой список или выбросить исключение
        return new ArrayList<>();
      }
    }

    return this.meetingService.getNearMeetings(preparedCoordinates, meetingDateTime);
  }

  /**
   * Получить список встреч по границам
   * @param bounds Границы в формате "lat1,lon1;lat2,lon2"
   * @return Список встреч
   */
  @GetMapping("/by-bounds")
  public List<Meeting> getMeetingsByBounds(
    @RequestParam(value = "bounds") Optional<String> bounds,
    @RequestParam(value = "date", required = false) Optional<String> date
  ) {
    if (bounds.isEmpty()) {
      return new ArrayList<>(); // Возвращаем пустой список, если границы не указаны
    }

    double[][] preparedBounds;

    try {
      // Разбиваем строку на массивы координат
      preparedBounds = Arrays.stream(bounds.get().split(";"))
        .map(b -> Arrays.stream(b.split(","))
          .mapToDouble(Double::parseDouble)
          .toArray())
        .toArray(double[][]::new);
    } catch (RuntimeException e) {
      return new ArrayList<>(); // Возвращаем пустой список в случае ошибки
    }

    // Проверяем, что границы корректны
    if (preparedBounds.length != 2 || preparedBounds[0].length != 2 || preparedBounds[1].length != 2) {
      return new ArrayList<>(); // Возвращаем пустой список, если границы некорректны
    }

    Instant meetingDateTime = null;

    if (date.isPresent()) {
      try {
        // Преобразуем строку в Instant
        meetingDateTime = Instant.parse(date.get());
      } catch (DateTimeParseException e) {
        // Обработка ошибки, если строка не соответствует формату
        // Можно вернуть пустой список или выбросить исключение
        return new ArrayList<>();
      }
    }

    // Вызываем сервис для получения встреч по границам
    return this.meetingService.findNearMeetings(preparedBounds, meetingDateTime);
  }

  /**
   * Удалить встречу
   * @param meetingId
   */
  @DeleteMapping
  public void delete(@RequestBody String meetingId) {
    this.meetingService.delete(meetingId);
  }

  /**
   * Добавить участника встречи
   * @param meeting
   */
  @PostMapping("/followers")
  public void addFollower(@RequestBody AddFollowerRequest meeting) {
    this.meetingService.addFollower(meeting.getMeetingId(), meeting.getFollowerId());
  }

  /**
   * Удалить участника встречи
   * @param meeting
   */
  @DeleteMapping("/followers")
  public void deleteFollower(@RequestBody DeleteFollowerRequest meeting) {
    this.meetingService.deleteFollower(meeting.getMeetingId(), meeting.getFollowerId());
  }
}
