import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Meeting } from '../models/meeting/meeting';
import { CreateMeetingResponse } from '../models/meeting/create-meeting-response';

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
   * Получение встречи по id
   * @param meetingId
   */
  getById({meetingId}: { meetingId: string }) {
    return this.http.get<Meeting>(`${this.apiPath}/${meetingId}`);
  }
}
