export interface TBook {
  title_uz: string;
  title_ru: string;
  title_en: string;
  author: string;
  price: string;
  discount: {
    percentage: number;
    start_date: string;
    end_date: string;
  };
  about_uz: string;
  about_ru: string;
  about_en: string;
  book_uz: object;
  book_ru: object;
  book_en: object;
  cover: object;
  pages: number;
}
