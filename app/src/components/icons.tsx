import type { ReactNode } from "react";

interface IconProps {
  size?: number;
  strokeWidth?: number;
}

function Icon({ size = 20, strokeWidth = 1.9, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export const IconCheck = (p: IconProps) => (
  <Icon strokeWidth={2.4} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);
export const IconClose = (p: IconProps) => (
  <Icon strokeWidth={2} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);
export const IconMap = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 4 3 6.5v13L9 17l6 2.5L21 17V4l-6 2.5L9 4z" />
    <path d="M9 4v13M15 6.5v13" />
  </Icon>
);
export const IconLink = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 4h6v6M20 4l-8.5 8.5" />
    <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </Icon>
);
export const IconList = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 6h13M8 12h13M8 18h13" />
    <circle cx="3.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
  </Icon>
);
export const IconLocate = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </Icon>
);
export const IconSun = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);
export const IconMoon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </Icon>
);
export const IconSearch = (p: IconProps) => (
  <Icon strokeWidth={2} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </Icon>
);
export const IconFilter = (p: IconProps) => (
  <Icon strokeWidth={2} {...p}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </Icon>
);

// モンスターボール（画像を持たないポケセン用）。Leaflet のピンでも使うので SVG 文字列も公開する
const BALL_INNER =
  '<circle cx="22" cy="22" r="20" fill="#fff"/><path d="M2 22a20 20 0 0 1 40 0z" fill="#ff5470"/><rect x="2" y="19.5" width="40" height="5" fill="#1c212d"/><circle cx="22" cy="22" r="6" fill="#fff" stroke="#1c212d" stroke-width="3"/>';

export const BALL_SVG = `<svg viewBox="0 0 44 44">${BALL_INNER}</svg>`;

export const PokeBall = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 44 44" className={className} aria-hidden dangerouslySetInnerHTML={{ __html: BALL_INNER }} />
);
