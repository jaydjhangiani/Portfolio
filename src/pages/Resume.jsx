import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Resume = () => {
  const navigate = useNavigate();
  const downloaded = useRef(false);

  useEffect(() => {
    if (downloaded.current) return;
    downloaded.current = true;
    const link = document.createElement('a');
    link.href = '/data/JayJhangianiNYU.pdf';
    link.download = 'JayJhangianiNYU.pdf';
    link.click();
    navigate('/', { replace: true });
  }, []);

  return null;
};

export default Resume;
