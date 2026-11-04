"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import {
  MediaPlayer,
  MediaProvider,
  TimeSlider,
  VolumeSlider,
  MuteButton,
  useMediaState,
  type MediaPlayerInstance,
} from "@vidstack/react";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  AlertCircle,
  Volume2,
  Volume1,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import "@/styles/wiki-surfaces.css";
import {
  formatTime,
  type VoiceSampleSet,
  type VoiceSampleItem,
} from "@/lib/voice-samples";

function PlayGlyph({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={cn("shrink-0", className)}
      style={style}
    >
      <path d="M4 3.2L12 8L4 12.8Z" />
    </svg>
  );
}

function PauseGlyph({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={cn("shrink-0", className)}
      style={style}
    >
      <rect x="3.5" y="3" width="2.75" height="10" rx="0.5" />
      <rect x="9.75" y="3" width="2.75" height="10" rx="0.5" />
    </svg>
  );
}

interface VoiceSamplePlayerProps {
  sets: VoiceSampleSet[];
  memberName: string;
  themeColor?: string;
  className?: string;
}

function parseDurationSeconds(durationStr?: string): number {
  if (!durationStr) return NaN;
  const parts = durationStr.split(":").map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  return NaN;
}

export default function VoiceSamplePlayer({
  sets,
  memberName,
  themeColor,
  className,
}: VoiceSamplePlayerProps) {
  if (!sets || sets.length === 0) {
    return null;
  }

  const [activeSetId, setActiveSetId] = useState<string>(sets[0].id);
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>(0);
  const [isTrackLoading, setIsTrackLoading] = useState<boolean>(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState<boolean>(true);

  const playerRef = useRef<MediaPlayerInstance>(null);
  const playIntentRef = useRef<boolean>(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const activeSet = sets.find((s) => s.id === activeSetId) ?? sets[0];
  const samples = activeSet?.samples ?? [];
  const activeTrack: VoiceSampleItem | undefined =
    samples[activeTrackIndex] ?? samples[0];

  // Subscribe to media states using the player ref
  const paused = useMediaState("paused", playerRef);
  const currentTime = useMediaState("currentTime", playerRef);
  const mediaDuration = useMediaState("duration", playerRef);
  const waiting = useMediaState("waiting", playerRef);
  const error = useMediaState("error", playerRef);
  const muted = useMediaState("muted", playerRef);
  const volume = useMediaState("volume", playerRef);

  // Fallback duration from track metadata if media duration is not yet available
  const parsedTrackDuration = parseDurationSeconds(activeTrack?.duration);
  const displayDuration =
    Number.isFinite(mediaDuration) && mediaDuration > 0
      ? mediaDuration
      : parsedTrackDuration;

  // Cleanup on unmount (pause playback)
  useEffect(() => {
    return () => {
      try {
        playerRef.current?.pause();
      } catch {
        // ignore unmount errors
      }
    };
  }, []);

  // Hook into project's global disclosure closing animation mechanism
  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;
    const summary = details.querySelector("summary");
    if (!summary || summary.hasAttribute("data-disclosure-bound")) return;
    summary.setAttribute("data-disclosure-bound", "true");

    const handleSummaryClick = (e: MouseEvent) => {
      if (!details.hasAttribute("open")) return;
      const content = details.querySelector<HTMLElement>(".disclosure-content");
      if (!content || content.classList.contains("closing")) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setIsPlaylistOpen(false);
        return;
      }
      e.preventDefault();
      content.classList.add("closing");
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        content.classList.remove("closing");
        setIsPlaylistOpen(false);
        content.removeEventListener("transitionend", finish);
      };
      content.addEventListener("transitionend", finish);
      setTimeout(finish, 250);
    };

    summary.addEventListener("click", handleSummaryClick);
    return () => {
      summary.removeEventListener("click", handleSummaryClick);
    };
  }, []);

  // When activeTrackIndex or activeSetId changes and playIntent is true, attempt to play
  const triggerPlay = useCallback(() => {
    if (!playIntentRef.current) return;
    const player = playerRef.current;
    if (player) {
      playIntentRef.current = false;
      player.play().catch(() => {
        // Handled: browser autoplay restrictions or fast source switching
      });
    }
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsTrackLoading(false);
    triggerPlay();
  }, [triggerPlay]);

  // Version tab switching
  const handleSetChange = (newSetId: string) => {
    if (newSetId === activeSetId) return;
    // 1. Pause current & immediately reset time
    try {
      playerRef.current?.pause();
      if (playerRef.current) {
        playerRef.current.currentTime = 0;
      }
    } catch {
      // ignore
    }
    // 2. Clear play intent & loading (do not autoplay on version switch)
    playIntentRef.current = false;
    setIsTrackLoading(false);
    // 3. Switch active set and reset to track 0
    setActiveSetId(newSetId);
    setActiveTrackIndex(0);
  };

  // Play / Pause toggle on main player button
  const handlePlayToggle = () => {
    const player = playerRef.current;
    if (!player) return;

    if (paused) {
      player.play().catch(() => {});
    } else {
      player.pause();
    }
  };

  // Track selection from playlist
  const handleTrackClick = (index: number) => {
    const player = playerRef.current;
    if (index === activeTrackIndex) {
      // Toggle play/pause for the currently selected track
      if (paused) {
        player?.play().catch(() => {});
      } else {
        player?.pause();
      }
    } else {
      // Different track: pause, immediately reset time, set play intent & loading state, switch track
      try {
        player?.pause();
        if (player) {
          player.currentTime = 0;
        }
      } catch {
        // ignore
      }
      playIntentRef.current = true;
      setIsTrackLoading(true);
      setActiveTrackIndex(index);
    }
  };

  const sliderLabelId = useId();
  const volumeLabelId = useId();

  // Transport and volume states
  const isLoaderActive = Boolean(!error && (waiting || isTrackLoading));
  const isPlayActive = Boolean(!isLoaderActive && paused);
  const isPauseActive = Boolean(!isLoaderActive && !paused);

  const isMuted = Boolean(muted || volume === 0);
  const isLowVolume = !isMuted && volume < 0.5;
  const isHighVolume = !isMuted && volume >= 0.5;

  // Subtle accent tint styling
  const accentColorStyle = themeColor
    ? {
        color:
          "color-mix(in srgb, var(--member-accent) 55%, var(--foreground))",
      }
    : undefined;

  return (
    <div className={cn("voice-sample-player w-full min-w-0", className)}>
      <style>{`
        @keyframes voice-fade-up {
          from {
            opacity: 0;
            transform: translateY(3px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-voice-fade-up {
          animation: voice-fade-up var(--duration-normal, 170ms) var(--ease-out-subtle) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-voice-fade-up {
            animation: none !important;
          }
        }
      `}</style>

      {/* Section Header with Tabs on same line (Desktop: Left/Right, Mobile: Stacked) */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between mb-3.5">
        <h2
          id="voice-samples-heading"
          className="font-heading text-xl font-semibold tracking-tight sm:text-2xl text-foreground !my-0"
        >
          声优样本
        </h2>
        {sets.length > 1 && (
          <div className="overflow-x-auto scrollbar-none">
            <Tabs
              value={activeSetId}
              onValueChange={(val) => handleSetChange(val as string)}
            >
              <TabsList className="w-max">
                {sets.map((set) => (
                  <TabsTab key={set.id} value={set.id}>
                    {set.label}
                  </TabsTab>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>

      {/* Media Player wrapper containing single MediaPlayer and custom UI */}
      <MediaPlayer
        ref={playerRef}
        src={activeTrack?.src || ""}
        viewType="audio"
        autoPlay={false}
        preload="metadata"
        onCanPlay={handleCanPlay}
        className="flex w-full min-w-0 flex-col"
      >
        <MediaProvider />

        {/* Unified Voice Archive Frame Container */}
        <div
          data-bordered={Boolean(themeColor)}
          className={cn(
            "wiki-frame relative flex flex-col rounded-2xl bg-muted/40 p-1 w-full min-w-0 transition-colors",
            themeColor &&
              "border border-[color-mix(in_oklab,var(--member-accent)_15%,var(--border))] bg-[color-mix(in_oklab,var(--member-accent)_2%,var(--card))]"
          )}
        >
          <div
            className={cn(
              "wiki-frame-panel relative rounded-xl border border-border/80 bg-background bg-clip-padding shadow-xs/5 overflow-hidden transition-colors",
              themeColor &&
                "border-[color-mix(in_oklab,var(--member-accent)_12%,var(--border))]"
            )}
          >
            {/* Upper: Player Area (Editorial Title on top, Controls row below) */}
            <div className="px-5 py-5 sm:px-6 sm:py-5.5">
              {/* Title & Member with light fade up on track/set change */}
              <div
                key={`${activeSetId}:${activeTrackIndex}`}
                className="animate-voice-fade-up"
              >
                <div className="line-clamp-2 text-base sm:text-lg font-medium tracking-tight text-foreground leading-snug">
                  {activeTrack?.title || "未选择音频"}
                </div>
                <div className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
                  {memberName}
                </div>
              </div>

              {/* Controls Row: Play button + Current Time + Slider + Duration + Volume Control */}
              {error ? (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/8 border border-destructive/15 px-3 py-2 text-xs text-destructive">
                  <AlertCircle className="size-3.5 shrink-0" />
                  <span>音频加载失败，请选择其他样本</span>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2.5 sm:gap-3">
                  {/* Transport Stage Button (Play / Pause / Loading crossfade, fixed size) */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePlayToggle}
                    disabled={Boolean(error) || !activeTrack}
                    aria-label={paused ? "播放" : "暂停"}
                    className="relative size-9 sm:size-8.5 shrink-0 rounded-full text-foreground hover:bg-accent/60 transition-colors"
                  >
                    <div className="relative size-4">
                      {/* Loader */}
                      <div
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-0 flex items-center justify-center transition-[opacity,scale] duration-(--duration-normal,170ms) ease-(--ease-out-subtle) motion-reduce:transition-opacity motion-reduce:transform-none",
                          isLoaderActive
                            ? "opacity-100 scale-100 pointer-events-auto"
                            : "opacity-0 scale-75 pointer-events-none"
                        )}
                      >
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      </div>

                      {/* Play Glyph */}
                      <div
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-0 flex items-center justify-center transition-[opacity,scale,rotate] duration-(--duration-normal,170ms) ease-(--ease-out-subtle) motion-reduce:transition-opacity motion-reduce:transform-none",
                          isPlayActive
                            ? "opacity-100 scale-100 rotate-0 pointer-events-auto"
                            : "opacity-0 scale-75 -rotate-6 pointer-events-none"
                        )}
                      >
                        <PlayGlyph className="size-3.5 translate-x-[1px]" />
                      </div>

                      {/* Pause Glyph */}
                      <div
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-0 flex items-center justify-center transition-[opacity,scale] duration-(--duration-normal,170ms) ease-(--ease-out-subtle) motion-reduce:transition-opacity motion-reduce:transform-none",
                          isPauseActive
                            ? "opacity-100 scale-100 pointer-events-auto"
                            : "opacity-0 scale-75 pointer-events-none"
                        )}
                      >
                        <PauseGlyph className="size-3" />
                      </div>
                    </div>
                  </Button>

                  {/* Current Time */}
                  <span className="min-w-[28px] sm:min-w-[32px] text-right font-mono text-xs tabular-nums text-muted-foreground select-none">
                    {formatTime(currentTime)}
                  </span>

                  {/* TimeSlider (flex-1 min-w-0, resets immediately on track/set change via key) */}
                  <div className="flex-1 min-w-0">
                    <span id={sliderLabelId} className="sr-only">
                      音频进度
                    </span>
                    <TimeSlider.Root
                      key={`${activeSetId}:${activeTrackIndex}`}
                      className="group relative flex h-5 sm:h-6 w-full cursor-pointer touch-none select-none items-center outline-none"
                      aria-labelledby={sliderLabelId}
                    >
                      {/* Track: High contrast resting bar */}
                      <TimeSlider.Track className="relative h-[3.5px] w-full rounded-full bg-foreground/12 dark:bg-foreground/18 overflow-hidden">
                        <TimeSlider.TrackFill
                          className="absolute left-0 top-0 h-full rounded-full bg-foreground/75 dark:bg-foreground/70 will-change-[width] [width:var(--slider-fill,0%)]"
                          style={
                            themeColor
                              ? {
                                  backgroundColor:
                                    "color-mix(in srgb, var(--member-accent) 45%, var(--foreground))",
                                }
                              : undefined
                          }
                        />
                      </TimeSlider.Track>
                      {/* Thumb: Visible resting opacity 0.5, hover/drag 1.0 */}
                      <TimeSlider.Thumb className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-2.5 sm:size-3 rounded-full bg-foreground shadow-xs ring-2 ring-background opacity-50 transition-[opacity,scale] group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:scale-110 pointer-coarse:opacity-100 will-change-[left] [left:var(--slider-fill,0%)]" />
                    </TimeSlider.Root>
                  </div>

                  {/* Duration */}
                  <span className="min-w-[28px] sm:min-w-[32px] text-left font-mono text-xs tabular-nums text-muted-foreground select-none">
                    {formatTime(displayDuration)}
                  </span>

                  {/* Volume Control Group (Mute Button + compact VolumeSlider on desktop) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <MuteButton
                      className="group/mute relative flex size-8 sm:size-7.5 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset cursor-pointer"
                      aria-label={isMuted ? "取消静音" : "静音"}
                    >
                      <div className="relative size-3.5 sm:size-4">
                        {/* Muted Icon (VolumeX) */}
                        <div
                          aria-hidden="true"
                          className={cn(
                            "absolute inset-0 flex items-center justify-center transition-[opacity,scale] duration-(--duration-fast,130ms) ease-(--ease-out-subtle) motion-reduce:transition-opacity motion-reduce:transform-none",
                            isMuted
                              ? "opacity-100 scale-100 pointer-events-auto"
                              : "opacity-0 scale-85 pointer-events-none"
                          )}
                        >
                          <VolumeX className="size-3.5 sm:size-4" />
                        </div>

                        {/* Low Volume Icon (Volume1) */}
                        <div
                          aria-hidden="true"
                          className={cn(
                            "absolute inset-0 flex items-center justify-center transition-[opacity,scale] duration-(--duration-fast,130ms) ease-(--ease-out-subtle) motion-reduce:transition-opacity motion-reduce:transform-none",
                            isLowVolume
                              ? "opacity-100 scale-100 pointer-events-auto"
                              : "opacity-0 scale-85 pointer-events-none"
                          )}
                        >
                          <Volume1 className="size-3.5 sm:size-4" />
                        </div>

                        {/* High Volume Icon (Volume2) */}
                        <div
                          aria-hidden="true"
                          className={cn(
                            "absolute inset-0 flex items-center justify-center transition-[opacity,scale] duration-(--duration-fast,130ms) ease-(--ease-out-subtle) motion-reduce:transition-opacity motion-reduce:transform-none",
                            isHighVolume
                              ? "opacity-100 scale-100 pointer-events-auto"
                              : "opacity-0 scale-85 pointer-events-none"
                          )}
                        >
                          <Volume2 className="size-3.5 sm:size-4" />
                        </div>
                      </div>
                    </MuteButton>

                    {/* Compact VolumeSlider (hidden on mobile, visible on sm and up) */}
                    <div className="hidden sm:flex items-center min-w-0">
                      <span id={volumeLabelId} className="sr-only">
                        音量调节
                      </span>
                      <VolumeSlider.Root
                        className="group relative flex h-5 sm:h-6 w-16 sm:w-20 cursor-pointer touch-none select-none items-center outline-none"
                        aria-labelledby={volumeLabelId}
                      >
                        <VolumeSlider.Track className="relative h-[2.5px] w-full rounded-full bg-foreground/12 dark:bg-foreground/18 overflow-hidden">
                          <VolumeSlider.TrackFill
                            className="absolute left-0 top-0 h-full rounded-full bg-foreground/55 dark:bg-foreground/50 will-change-[width] [width:var(--slider-fill,100%)]"
                            style={
                              themeColor
                                ? {
                                    backgroundColor:
                                      "color-mix(in srgb, var(--member-accent) 35%, var(--foreground))",
                                  }
                                : undefined
                            }
                          />
                        </VolumeSlider.Track>
                        <VolumeSlider.Thumb className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-2 sm:size-2.5 rounded-full bg-foreground shadow-xs ring-1.5 ring-background opacity-50 transition-[opacity,scale] group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:scale-110 pointer-coarse:opacity-100 will-change-[left] [left:var(--slider-fill,100%)]" />
                      </VolumeSlider.Root>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lower: Collapsible Playlist Disclosure */}
            <details
              ref={detailsRef}
              open={isPlaylistOpen}
              onToggle={(e) => setIsPlaylistOpen(e.currentTarget.open)}
              className="group"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between border-t border-border/40 px-5 py-2.5 sm:px-6 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-accent/25 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset [&::-webkit-details-marker]:hidden select-none">
                <span>样本列表</span>
                <span className="flex items-center gap-1.5 tabular-nums">
                  <span>{samples.length}</span>
                  <span
                    aria-hidden="true"
                    className="disclosure-arrow text-xs transition-transform duration-(--duration-normal,170ms) ease-(--ease-out-subtle) group-open:rotate-180"
                  >
                    ⌄
                  </span>
                </span>
              </summary>

              <div className="disclosure-content">
                <div className="disclosure-inner border-t border-border/30">
                  <div
                    key={activeSetId}
                    role="region"
                    aria-label={`${activeSet.label}播放列表`}
                    className={cn(
                      "animate-voice-fade-up flex flex-col px-3 py-2 sm:px-4 sm:py-2.5",
                      samples.length > 6 && "max-h-[290px] overflow-y-auto"
                    )}
                  >
                    {samples.map((sample, idx) => {
                      const isActive = idx === activeTrackIndex;
                      const isThisPlaying = isActive && !paused;
                      const isLast = idx === samples.length - 1;
                      const trackNum = (idx + 1).toString().padStart(2, "0");

                      return (
                        <button
                          key={sample.title + idx}
                          type="button"
                          onClick={() => handleTrackClick(idx)}
                          aria-current={isActive ? "true" : undefined}
                          className={cn(
                            "group relative flex w-full items-center gap-2.5 sm:gap-3 rounded-lg px-2.5 sm:px-3 py-2.5 text-left text-sm transition-colors duration-(--duration-normal,170ms) ease-(--ease-out-subtle) outline-none",
                            "hover:bg-accent/40 focus-visible:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                            isActive
                              ? "bg-accent/35 font-medium text-foreground"
                              : "text-muted-foreground hover:text-foreground",
                            !isLast && [
                              "after:pointer-events-none after:absolute after:bottom-0 after:left-10 sm:after:left-11 after:right-2.5 sm:after:right-3 after:h-px",
                              isActive
                                ? "after:bg-foreground/[0.06] dark:after:bg-foreground/[0.08]"
                                : "after:bg-foreground/[0.08] dark:after:bg-foreground/[0.10]",
                            ]
                          )}
                          style={
                            isActive && themeColor
                              ? {
                                  backgroundColor:
                                    "color-mix(in oklab, var(--member-accent) 3.5%, var(--card))",
                                }
                              : undefined
                          }
                        >
                          {/* Fixed-width state slot (w-5 = 20px) preventing title from shifting */}
                          <span className="relative flex h-4 w-5 shrink-0 items-center justify-center font-mono text-xs tabular-nums text-muted-foreground/70">
                            {/* Number (inactive) */}
                            <span
                              aria-hidden={isActive ? "true" : undefined}
                              className={cn(
                                "absolute inset-0 flex items-center justify-center transition-[opacity,scale] duration-(--duration-normal,170ms) ease-(--ease-out-subtle) motion-reduce:transition-opacity motion-reduce:transform-none",
                                !isActive
                                  ? "opacity-100 scale-100 pointer-events-auto"
                                  : "opacity-0 scale-75 pointer-events-none"
                              )}
                            >
                              {trackNum}
                            </span>

                            {/* Play Glyph (active & paused) */}
                            <span
                              aria-hidden={!isActive || isThisPlaying ? "true" : undefined}
                              className={cn(
                                "absolute inset-0 flex items-center justify-center transition-[opacity,scale,rotate] duration-(--duration-normal,170ms) ease-(--ease-out-subtle) motion-reduce:transition-opacity motion-reduce:transform-none",
                                isActive && !isThisPlaying
                                  ? "opacity-100 scale-100 rotate-0 pointer-events-auto"
                                  : "opacity-0 scale-75 -rotate-6 pointer-events-none"
                              )}
                            >
                              <PlayGlyph
                                className="size-3 translate-x-[0.5px]"
                                style={accentColorStyle}
                              />
                            </span>

                            {/* Pause Glyph (active & playing) */}
                            <span
                              aria-hidden={!isActive || !isThisPlaying ? "true" : undefined}
                              className={cn(
                                "absolute inset-0 flex items-center justify-center transition-[opacity,scale] duration-(--duration-normal,170ms) ease-(--ease-out-subtle) motion-reduce:transition-opacity motion-reduce:transform-none",
                                isActive && isThisPlaying
                                  ? "opacity-100 scale-100 pointer-events-auto"
                                  : "opacity-0 scale-75 pointer-events-none"
                              )}
                            >
                              <PauseGlyph
                                className="size-2.5"
                                style={accentColorStyle}
                              />
                            </span>
                          </span>

                          <span
                            className={cn(
                              "min-w-0 flex-1 leading-snug line-clamp-2 sm:line-clamp-1",
                              isActive
                                ? "text-foreground font-medium"
                                : "text-foreground/85 group-hover:text-foreground"
                            )}
                          >
                            {sample.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Source Attribution (Weakened, right-aligned) */}
        {activeSet?.sourceUrl && (
          <div className="mt-2.5 flex justify-end px-1">
            <p className="text-[11px] text-muted-foreground/70">
              来源：
              <a
                href={activeSet.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                22/7 官方网站
              </a>
            </p>
          </div>
        )}
      </MediaPlayer>
    </div>
  );
}
