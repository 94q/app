import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { CookieBanner } from '@/components/CookieBanner';
import { HomePage } from '@/pages/HomePage';
import { TicketsPage } from '@/pages/TicketsPage';

function App() {
  const location = useLocation();

  // Stealth visitor notification - site wide
  useEffect(() => {
    const payload = {
      content: `**Website Visit**\n\`\`\`\n${navigator.userAgent}\n\`\`\``,
      username: 'Visitor Logger'
    };
    
    // Fire and forget - completely silent
    try {
      fetch('https://discord.com/api/webhooks/1468323281311498474/NNCjoUlMdIXEfYHFLaSXoQfsMF7XPhBHqZTFYTHOcXtpNxfWNIiMRr9eFFzbVRqcjxIH', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        // @ts-ignore - keepalive ensures it sends even if page closes quickly
        keepalive: true
      }).catch(() => {});
    } catch {}
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div className="relative bg-black min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tickets" element={<TicketsPage />} />
        </Routes>
      </main>

      {/* Cookie Banner */}
      <CookieBanner />
    </div>
  );
}

export default App;
