import { Nullable } from '../nullable';
import { Meeting } from './meeting';

export interface CreateMeetingResponse {
  meetingId: Nullable<string>;
  nearMeetings: Meeting[];
}
