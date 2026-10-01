export const FONT_SCALE_LEVELS = [
  { label: "小", percent: 87.5 },
  { label: "中", percent: 100 },
  { label: "大", percent: 112.5 },
  { label: "特大", percent: 125 },
] as const;

export const FONT_SCALE_STORAGE_KEY = "reset:font-scale";
export const DEFAULT_FONT_SCALE_INDEX = 1;

export function isValidFontScaleIndex(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value < FONT_SCALE_LEVELS.length;
}

/** Inlined as a blocking <script> in the root layout to avoid a flash of
 * default-size text before React hydrates and re-applies the saved level. */
export const FONT_SCALE_BLOCKING_SCRIPT = `(function(){try{var p=[${FONT_SCALE_LEVELS.map((l) => l.percent).join(",")}];var i=parseInt(localStorage.getItem("${FONT_SCALE_STORAGE_KEY}"),10);var v=p[i];document.documentElement.style.fontSize=(v||100)+"%";}catch(e){}})();`;
