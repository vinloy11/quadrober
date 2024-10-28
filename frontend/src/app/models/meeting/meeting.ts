import { User } from '../user/user';
import { AbstractMeeting } from './abstract-meeting';

/**
 * com.shtrokfm.quadrober.entity.Meeting
 */
export interface Meeting extends AbstractMeeting {
  id?: string;

  owner: User;

  followers: User[];
}
