import { Address } from './address';

export interface AbstractMeeting {
  address: Address;

  meetingDateTime: Date | string | number;
}
