import React, { useEffect, useMemo, useState } from 'react';

const EVENT_START = new Date('2026-05-23T08:00:00+03:00').getTime();

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(): TimeLeft {
  const remaining = Math.max(0, EVENT_START - Date.now());

  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining % 86_400_000) / 3_600_000),
    minutes: Math.floor((remaining % 3_600_000) / 60_000),
    seconds: Math.floor((remaining % 60_000) / 1_000),
  };
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const displayValue = value.toString().padStart(2, '0');

  return (
    <div className="countdown-unit" aria-label={`${value} ${label}`}>
      <div key={displayValue} className="countdown-flip-card">
        <span>{displayValue}</span>
      </div>
      <span className="countdown-unit-label">{label}</span>
    </div>
  );
}

export const CountdownBar: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1_000);

    return () => window.clearInterval(timer);
  }, []);

  const units = useMemo(
    () => [
      { label: 'days', value: timeLeft.days },
      { label: 'hours', value: timeLeft.hours },
      { label: 'minutes', value: timeLeft.minutes },
      { label: 'seconds', value: timeLeft.seconds },
    ],
    [timeLeft]
  );

  return (
    <aside className="countdown-top-bar" aria-label="Event countdown">
      <div className="countdown-top-bar-inner">
        <div className="countdown-units">
          {units.map((unit) => (
            <FlipUnit key={unit.label} value={unit.value} label={unit.label} />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CountdownBar;
