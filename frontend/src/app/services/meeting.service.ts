import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Meeting } from '../models/meeting/meeting';
import { CreateMeetingResponse } from '../models/meeting/create-meeting-response';
import { MeetingSearchCriteria } from '../models/meeting/meeting-search-criteria';

/**
 *
 * com.shtrokfm.quadrober.meeting.MeetingController;
 * Контроллер для CRUD операций над встречами
 */

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private readonly apiPath = '/api/meetings';

  constructor(
    private readonly http: HttpClient
  ) { }

  /**
   * Создание встречи
   * @param meeting
   * @return Meeting[]
   */
  create(meeting: Meeting) {
    return this.http.post<CreateMeetingResponse>(this.apiPath, meeting);
  }

  /**
   * Изменение встречи
   * @param meeting
   * @return Meeting[]
   */
  update(meeting: Meeting) {
    return this.http.put<Meeting>(this.apiPath, meeting);
  }

  /**
   * Получение встречи по id
   * @param meetingId
   */
  getById({meetingId}: { meetingId: string }) {
    return this.http.get<Meeting>(`${this.apiPath}/${meetingId}`);
  }

  /**
   * Получить встречи пользователя
   */
  getMyMeetings() {
    return this.http.get<Meeting[]>(`${this.apiPath}/my-meetings`);
  }

  /**
   * Получить список встреч по параметрам
   * @param criteria
   */
  getMeetings(criteria: MeetingSearchCriteria) {
    return this.http.get<Meeting[]>(`${this.apiPath}/by-bounds`, {
      params: {
        bounds: criteria.bounds || [],
        date: criteria.date || [],
        offset: new Date().getTimezoneOffset(),
      }
    });
  }

  /**
   * Создание встречи
   * @param meetingId
   * @return boolean
   */
  delete(meetingId: string) {
    return this.http.delete<boolean>(this.apiPath, {
      body: meetingId
    });
  }
}
