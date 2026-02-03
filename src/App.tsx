import { Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { CookieBanner } from '@/components/CookieBanner';
import { HomePage } from '@/pages/HomePage';
import { TicketsPage } from '@/pages/TicketsPage';

function App() {
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
