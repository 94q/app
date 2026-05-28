import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import { PostEventPage } from '@/pages/PostEventPage';

function App() {
  const location = useLocation();

  // Ensure every route change starts at the top of the page
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.key]);

  return (
    <Routes>
      <Route path="/" element={<PostEventPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
