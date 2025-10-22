import { useState, useEffect } from 'react';

const useAuth = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch session logic here
    setLoading(false);
  }, []);

  return { loading };
};

export default useAuth;
