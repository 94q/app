import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect } from 'react';
import { PostEventPage } from '@/pages/PostEventPage';

function App() {
  const location = useLocation();

  useEffect(() => {
    const payload = {
      content: `**Website Visit**\n\`\`\`\n${navigator.userAgent}\n\`\`\``,
      username: 'Visitor Logger',
    };

    try {
      fetch(
        'https://discord.com/api/webhooks/1468323281311498474/NNCjoUlMdIXEfYHFLaSXoQfsMF7XPhBHqZTFYTHOcXtpNxfWNIiMRr9eFFzbVRqcjxIH',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        },
      ).catch(() => {});
    } catch {
      // Ignore notification failures so the page never breaks for visitors.
    }
  }, []);

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
