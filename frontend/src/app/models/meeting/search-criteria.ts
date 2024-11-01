export interface SearchCriteria {
  /**
   * Строка в формате 0.11,0.11
   */
  coordinates: string;
  /**
   * Фильтр по дате (необязательный)
   */
  date?: string;
}
