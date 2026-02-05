import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { CookieBanner } from '@/components/CookieBanner';
import { HomePage } from '@/pages/HomePage';
import { TicketsPage } from '@/pages/TicketsPage';
import { FAQPage } from '@/pages/FAQPage';

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

  // Ensure every route change starts at the top of the page
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.key]);

  return (
    <div className="relative bg-black min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
      </main>

      {/* Cookie Banner */}
      <CookieBanner />
    </div>
  );
}

export default App;
