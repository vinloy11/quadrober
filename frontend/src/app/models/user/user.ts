import { SocialMediaLink } from './social-media-link';

/**
 * com.shtrokfm.quadrober.entity.User
 */
export interface User {
  id?: string;

  name: string;
  /**
   * Айди от телеграмма
   */
  telegramId?: string;
  /**
   * Дата рождения
   */
  dateBirthday: Date | string;
  /**
   * Рассказ о себе
   * max = 550
   */
  bio: string;

  /**
   * Ссылки на социальные сети
   */
  socialMediaLinks: SocialMediaLink[] ;
}
