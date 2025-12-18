export interface Book {
  title: string;
  author: string;
  image: string;
  description: string;
}

export const RECENTLY_READ_BOOKS: Book[] = [
  {
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    image: "book_cover/the_pragmatic_programmer_book_cover.jpg",
    description:
      "The Pragmatic Programmer: From Journeyman to Master is a book about computer programming and software engineering, written by Andrew Hunt and David Thomas and published in October 1999.",
  },
  {
    title: "A Philosophy of Software Design",
    author: "John Ousterhout",
    image: "book_cover/philosophy_software_designer_book_cover.jpg",
    description:
      '"A Philosophy of Software Design" by John Ousterhout offers timeless principles for creating clean, maintainable code. It emphasizes deep modules, managing complexity, and thoughtful abstractions, making it a must-read for developers aiming to write better software.',
  },
  {
    title: "1984",
    author: "George Orwell",
    image: "book_cover/oneThousandNineHundredEightyFourBookCover.jpg",
    description:
      "George Orwell's 1984 is a dystopian masterpiece exploring themes of totalitarianism, surveillance, and the manipulation of truth. Set in a bleak future, it follows Winston Smith as he struggles against an oppressive regime that seeks to control every aspect of life.",
  },
];

export const CURRENTLY_READING_BOOK: Book = {
  title: "The AI Engineer",
  author: "Chip Huyen",
  image: "book_cover/ai_engineer_book_cover.jpg",
  description:
    "A practical guide to building and deploying AI systems in production. Covers the full lifecycle of AI projects from data collection to deployment and monitoring.",
};
