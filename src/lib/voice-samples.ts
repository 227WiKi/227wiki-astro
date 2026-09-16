import { resourceUrl } from "@/lib/assets";

export interface VoiceSampleItem {
  title: string;
  src: string;
  duration?: string;
}

export interface VoiceSampleSet {
  id: string;
  label: string;
  description?: string;
  sourceUrl?: string;
  samples: VoiceSampleItem[];
}

/**
 * Resolves a voice sample src.
 * Absolute HTTP/HTTPS URLs are returned directly.
 * Relative paths are resolved against the site's resource origin via `resourceUrl`.
 */
export function resolveAudioUrl(src: string): string {
  if (/^(?:https?:\/\/|data:)/i.test(src)) {
    return src;
  }
  return resourceUrl(src);
}

/**
 * Formats a duration or current playback time in seconds into m:ss format.
 * Returns "--:--" for NaN, non-finite, or negative numbers.
 */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "--:--";
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
