const icons = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="M20 6 9 17l-5-5" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" /></>,
  file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18M8 14h3v3H8z" /></>,
  note: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="m9 15 .8-3.2L15 6.6 17.4 9l-5.2 5.2z" /></>,
  building: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M10 21v-4h4v4M9 7h1M14 7h1M9 11h1M14 11h1" /></>,
  checkFilled: <><circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" /><path d="m8 12.5 2.8 2.8 5.7-5.8" stroke="#fff" /></>,
  alert: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5V13M12 16.5v.01" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.01" /></>,
  bed: <><path d="M3 19V6M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-7v6" /><circle cx="7" cy="11.5" r="1.8" /></>,
  bus: <><rect x="4" y="3" width="16" height="15" rx="3" /><path d="M4 11h16M8 21v-3M16 21v-3M8 14.5h.01M16 14.5h.01" /></>,
  utensils: <path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M18 3c-2.2 1.8-3 4.3-3 7.5h3V21" />,
  ticket: <><path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z" /><path d="M14 7v2M14 11v2M14 15v2" /></>,
  box: <><path d="M21 8 12 3 3 8v8l9 5 9-5z" /><path d="m3 8 9 5 9-5M12 13v8" /></>,
  dot: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2.5" fill="currentColor" /></>,
  receipt: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6" /></>,
  circle: <circle cx="12" cy="12" r="8" />,
  more: <><circle cx="5" cy="12" r="1.3" fill="currentColor" /><circle cx="12" cy="12" r="1.3" fill="currentColor" /><circle cx="19" cy="12" r="1.3" fill="currentColor" /></>,
  upload: <><path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8" /><path d="M12 12v8M9 15l3-3 3 3" /></>,
  pencil: <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" />,
  coins: <><ellipse cx="9" cy="6" rx="6" ry="2.5" /><path d="M3 6v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V6M3 10v4c0 1.4 2.7 2.5 6 2.5" /><ellipse cx="16" cy="15" rx="5" ry="2.2" /><path d="M11 15v3.5c0 1.2 2.2 2.2 5 2.2s5-1 5-2.2V15" /></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  sparkle: <path d="M10 3l1.8 5.2L17 10l-5.2 1.8L10 17l-1.8-5.2L3 10l5.2-1.8zM18 15l.8 1.7 1.7.8-1.7.8L18 20l-.8-1.7-1.7-.8 1.7-.8z" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
};

export function Icon({ name, size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

export function Logo() {
  return (
    <span className="lp-logo">
      <svg viewBox="0 0 34 24" aria-hidden="true">
        <path d="M1 23 12 4l11 19z" fill="#3fe3ee" />
        <path d="M14 23l8-12 11 12z" fill="#16b6d8" />
        <path d="M12 4l3.5 6-2-1-1.5 1.5L10.5 9l-2 1z" fill="#fff" />
      </svg>
      Roveboard
    </span>
  );
}
