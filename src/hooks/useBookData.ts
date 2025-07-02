import { useState, useEffect } from 'react';

export interface BookPage {
  id: number;
  imageUrl: string;
  text: string;
  textPosition: {
    top: string;
    left: string;
  };
  textBgColor: string;
  videoWebmUrl?: string;
  videoMp4Url?: string;
  audioUrl: string;
}

export interface GlossaryTerm {
  id: number;
  word: string;
  definition: string;
  pictogram: string;
  audioUrl: string;
  videoUrl: string;
}

export interface GlossaryData {
  title: string;
  terms: GlossaryTerm[];
}

export interface BookData {
  id: string;
  title: string;
  description: string;
  metadata: {
    author: string;
    illustrator: string;
    language: string;
    category: string;
    ageRange: string;
  };
  pages: BookPage[];
  glossary: GlossaryData; // ✅ Glosario incluido
}

export function useBookData(bookId: string) {
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/data/books/${bookId}.json`);
        
        if (!response.ok) {
          throw new Error(`Error loading book data: ${response.status}`);
        }
        
        const data: BookData = await response.json();
        setBookData(data);
      } catch (err) {
        console.error('Error loading book data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (bookId) {
      loadBookData();
    }
  }, [bookId]);

  return { bookData, loading, error };
}