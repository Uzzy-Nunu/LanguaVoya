// config/brand.ts — the ONLY place the name appears
import { tokens } from "@/theme/tokens";

export const brand = {
  name: 'LanguaVoya', // working name, pending clearance
  tagline: 'Learn the language. Live the experience.',
  logo: {
    mark: '/brand/mark.svg',
    wordmark: '/brand/wordmark.svg',
    appIcon: '/brand/app-icon.svg',
  },
  colors: {
    primary: tokens.color.coral,
    secondary: tokens.color.lagoon,
    highlight: tokens.color.sun,
  },
  taglineSurfaces: ['welcome', 'day1-intro', 'final-recap'],
} as const;
