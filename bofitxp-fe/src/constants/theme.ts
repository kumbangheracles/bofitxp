/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",

    rajdhani: "rajdhani-",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const palette = {
  // --- Backgrounds ---
  bgDeep: "#0A0A0F",
  bgSurface: "#13131F",
  bgElevated: "#1C1C2E",
  bgBorder: "#252540",

  // --- Primary: Electric Violet ---
  violet: "#6C3FFF",
  violetHover: "#8B5CF6",
  violetLabel: "#A78BFA",
  violetMuted: "#C4B5FD",

  // --- Success / XP: Neon Teal ---
  teal: "#00D4AA",
  tealProgress: "#2EEFC7",

  // --- Achievement: Champion Gold ---
  gold: "#FFD700",
  goldGlow: "#FFE44D",

  // --- Energy / Combo: Fire Orange ---
  orange: "#FF6B35",
  orangeSecondary: "#FF8C5A",

  // --- Alert ---
  danger: "#F43F5E",

  // --- Text ---
  textPrimary: "#FFFFFF",
  textSecondary: "#B0B0C8",
  textHint: "#6B6B8A",

  // --- Light mode backgrounds ---
  lightBgDeep: "#F0F0F7",
  lightBgSurface: "#FFFFFF",
  lightBgElevated: "#E8E8F5",
  lightBgBorder: "#D0D0E8",

  // --- Light mode text ---
  lightTextPrimary: "#0A0A0F",
  lightTextSecondary: "#3A3A5C",
  lightTextHint: "#7878A0",
} as const;

// ─────────────────────────────────────────
// DARK THEME (default)
// ─────────────────────────────────────────
export const darkTheme = {
  // Backgrounds
  background: palette.bgDeep,
  surface: palette.bgSurface,
  elevated: palette.bgElevated,
  border: palette.bgBorder,

  // Primary
  primary: palette.violet,
  primaryHover: palette.violetHover,
  primaryLabel: palette.violetLabel,
  primaryMuted: palette.violetMuted,

  // Semantic colors
  xp: palette.teal,
  xpProgress: palette.tealProgress,
  achievement: palette.gold,
  achievementGlow: palette.goldGlow,
  combo: palette.orange,
  comboSecondary: palette.orangeSecondary,
  danger: palette.danger,

  // Text
  text: palette.textPrimary,
  textSecondary: palette.textSecondary,
  textHint: palette.textHint,
} as const;

// ─────────────────────────────────────────
// LIGHT THEME
// ─────────────────────────────────────────
export const lightTheme = {
  // Backgrounds
  background: palette.lightBgDeep,
  surface: palette.lightBgSurface,
  elevated: palette.lightBgElevated,
  border: palette.lightBgBorder,

  // Primary (sama, tetap vibrant)
  primary: palette.violet,
  primaryHover: palette.violetHover,
  primaryLabel: palette.violetLabel,
  primaryMuted: palette.violetMuted,

  // Semantic colors (sama)
  xp: palette.teal,
  xpProgress: palette.tealProgress,
  achievement: palette.gold,
  achievementGlow: palette.goldGlow,
  combo: palette.orange,
  comboSecondary: palette.orangeSecondary,
  danger: palette.danger,

  // Text
  text: palette.lightTextPrimary,
  textSecondary: palette.lightTextSecondary,
  textHint: palette.lightTextHint,
} as const;

// ─────────────────────────────────────────
// THEME TYPE
// ─────────────────────────────────────────
export type AppTheme = {
  background: string;
  surface: string;
  elevated: string;
  border: string;
  primary: string;
  primaryHover: string;
  primaryLabel: string;
  primaryMuted: string;
  xp: string;
  xpProgress: string;
  achievement: string;
  achievementGlow: string;
  combo: string;
  comboSecondary: string;
  danger: string;
  text: string;
  textSecondary: string;
  textHint: string;
};

export const Colors = {
  dark: darkTheme,
  light: lightTheme,
} as const;

// ─────────────────────────────────────────
// SPACING
// ─────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ─────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────
export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

// ─────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────
export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 36,
} as const;

export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,
};
