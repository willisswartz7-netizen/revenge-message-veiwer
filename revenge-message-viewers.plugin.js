// revenge-message-viewers.plugin.js

/**
 * Revenge — Message Viewer Plugin
 * Shows who viewed messages inside your own Revenge app.
 */

(() => {
  "use strict";

  const PLUGIN = {
    name: "Revenge Message Viewers",
    id: "revenge-message-viewers",
    version: "1.0.0",
    description: "Shows members who viewed a message.",
    author: "L1ght"
  };

  const state = {
    views: new Map(),
    enabled: true
  };

  function ensureMessage(messageId) {
    if (!state.views.has(messageId)) {
      state.views.set(messageId, new Map());
    }

    return state.views.get(messageId);
  }

  function recordView(messageId, user) {
    if (!state.enabled || !messageId || !user?.id) return;

    const viewers = ensureMessage(messageId);

    viewers.set(user.id, {
      id: user.id,
      username: user.username ?? "Unknown User",
      avatar: user.avatar ?? null,
      viewedAt: Date.now()
    });

    updateMessageUI(messageId);
  }

  function getViewers(messageId) {
    const viewers = state.views.get(messageId);

    if (!viewers) return [];

    return [...viewers.values()]
      .sort((a, b) => a.viewedAt - b.viewedAt);
  }

  function updateMessageUI(messageId) {
    const element = document.querySelector(
      `[data-message-id="${CSS.escape(messageId)}"]`
    );

    if (!element) return;

    let badge = element.querySelector(
      ".revenge-message-viewers"
    );

    const viewers = getViewers(messageId);

    if (!badge) {
      badge = document.createElement("button");
      badge.className = "revenge-message-viewers";

      Object.assign(badge.style, {
        border: "0",
        background: "transparent",
        color: "var(--text-muted, #888)",
        fontSize: "11px",
        cursor: "pointer",
        padding: "2px 0"
      });

      element.appendChild(badge);
    }

    badge.textContent =
      viewers.length === 0
        ? "No views"
        : `Seen by ${viewers.length}`;

    badge.onclick = event => {
      event.stopPropagation();
      showViewerPopup(messageId, badge);
    };
  }

  function showViewerPopup(messageId, anchor) {
    document
      .querySelectorAll(".revenge-viewer-popup")
      .forEach(el => el.remove());

    const viewers = getViewers(messageId);

    const popup = document.createElement("div");

    popup.className = "revenge-viewer-popup";

    Object.assign(popup.style, {
      position: "fixed",
      zIndex: "999999",
      minWidth: "230px",
      maxWidth: "320px",
      maxHeight: "350px",
      overflowY: "auto",
      padding: "12px",
      borderRadius: "10px",
      background: "var(--background-floating, #18191c)",
      color: "var(--text-normal, white)",
      boxShadow: "0 8px 30px rgba(0,0,0,.35)"
    });

    const rect = anchor.getBoundingClientRect();

    popup.style.left = `${Math.min(
      rect.left,
      window.innerWidth - 340
    )}px`;

    popup.style.top = `${Math.min(
      rect.bottom + 6,
      window.innerHeight - 360
    )}px`;

   
