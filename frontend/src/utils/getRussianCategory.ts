const categoryTranslations: Record<string, string> = {
  "Politics": "Политика",
  "Business": "Экономика",
  "Culture": "Культура",
  "Health": "Здоровье",
  "Tech": "Технологии",
  "Sports": "Спорт",
};

export const getTranslatedCategory = (category: string): string => {
  return categoryTranslations[category];
}
