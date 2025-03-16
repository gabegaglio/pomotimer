import axios from 'axios';
import { useEffect, useState } from 'react';

function useQuote() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const url = 'http://localhost:5000/api/quote'; // Fetch from backend

  useEffect(() => {
    const getQuote = async () => {
      try {
        const response = await axios.get(url);
        if (response.data && response.data.length > 0) {
          setQuote(response.data[0].q);
          setAuthor(response.data[0].a);
        } else {
          console.error('Unexpected API response:', response.data);
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
      }
    };

    getQuote();
  }, []);

  return { quote, author };
}

export default useQuote;
