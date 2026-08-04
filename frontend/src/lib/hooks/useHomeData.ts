import { useState, useEffect } from 'react';
import { fetchHomepage, type HomepageData } from '../services/api';

interface UseHomeDataResult {
  data: HomepageData | null;
  loading: boolean;
  error: string | null;
}

export const useHomeData = (): UseHomeDataResult => {
  const [data, setData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchHomepage();
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
};
