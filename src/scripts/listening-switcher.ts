import { getListeningEmbed } from "../lib/listening.ts";

class ListeningSwitcher extends HTMLElement {
  private indicatorAnimation?: Animation;
  private resizeObserver?: ResizeObserver;

  connectedCallback() {
    const switcher = this.querySelector<HTMLElement>("[data-platform-switcher]");
    if (switcher) {
      switcher.hidden = false;
      this.updateIndicator();
      this.resizeObserver = new ResizeObserver(() => this.updateIndicator());
      this.querySelectorAll<HTMLElement>('[role="radiogroup"], [role="radiogroup"] label')
        .forEach((node) => this.resizeObserver?.observe(node));
    }
    this.addEventListener("change", this.onChange);
    document.addEventListener("astro:before-swap", this.reset);
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
    this.indicatorAnimation?.cancel();
    this.reset();
    this.removeEventListener("change", this.onChange);
    document.removeEventListener("astro:before-swap", this.reset);
  }

  private reset = () => {
    this.querySelector("[data-player-mount]")?.replaceChildren();
  };

  private updateIndicator(animate = false) {
    const indicator = this.querySelector<HTMLElement>("[data-listening-indicator]");
    const label = this.querySelector<HTMLInputElement>("[data-listening-choice]:checked")?.parentElement;
    const group = indicator?.parentElement;
    if (!indicator || !label || !group) return;
    // Measure the visible position before cancelling, so rapid switches continue smoothly.
    const previous = indicator.getBoundingClientRect();
    const target = label.getBoundingClientRect();
    const root = group.getBoundingClientRect();
    this.indicatorAnimation?.cancel();
    const transform = `translate(${target.left - root.left}px, ${target.top - root.top}px)`;
    indicator.style.transform = transform;
    indicator.style.width = `${target.width}px`;
    indicator.style.height = `${target.height}px`;
    if (animate && previous.width && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.indicatorAnimation = indicator.animate([
        { transform: `translate(${previous.left - root.left}px, ${previous.top - root.top}px)`, width: `${previous.width}px`, height: `${previous.height}px` },
        { transform, width: `${target.width}px`, height: `${target.height}px` },
      ], { duration: 200, easing: "cubic-bezier(0.2, 0, 0, 1)" });
    }
  }

  private onChange = (event: Event) => {
    const choice = event.target;
    if (!(choice instanceof HTMLInputElement) || !choice.matches("[data-listening-choice]:checked")) return;
    const embed = getListeningEmbed({
      provider: choice.dataset.provider ?? "",
      url: "",
      embedUrl: choice.dataset.embedUrl,
    });
    const mount = this.querySelector<HTMLElement>("[data-player-mount]");
    if (!embed || !mount) return;
    // Remove the old browsing context before inserting the new player, stopping its media.
    this.reset();
    const iframe = document.createElement("iframe");
    iframe.src = embed.url;
    iframe.title = `${this.dataset.songTitle} — ${choice.dataset.label} 试听播放器`;
    iframe.width = "100%";
    iframe.height = String(embed.height);
    iframe.className = "block w-full rounded-lg border-0";
    iframe.loading = "lazy";
    iframe.allow = "encrypted-media; fullscreen; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    if (embed.provider === "apple-music") {
      iframe.sandbox.value = "allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation";
    }
    mount.replaceChildren(iframe);
    this.querySelectorAll<HTMLInputElement>("[data-listening-choice]").forEach((input) => {
      input.parentElement?.toggleAttribute("data-checked", input.checked);
    });
    this.updateIndicator(true);
  };
}

if (!customElements.get("listening-switcher")) customElements.define("listening-switcher", ListeningSwitcher);
