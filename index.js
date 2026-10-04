import { logger } from "@revenge";

const viewers = new Map();

function recordView(messageId, user) {
  if (!messageId || !user?.id) return;

  if (!viewers.has(messageId)) {
    viewers.set(messageId, new Map());
  }

  viewers.get(messageId).set(user.id, {
    id: user.id,
    username: user.username ?? "Unknown User",
    viewedAt: Date.now()
  });
}

function getViewers(messageId) {
  return [...(viewers.get(messageId)?.values() ?? [])];
}

export default {
  onLoad() {
    logger.log("[Message Viewers] Loaded");

    globalThis.RevengeMessageViewers = {
      recordView,
      getViewers,

      getViewerCount(messageId) {
        return getViewers(messageId).length;
      },

      clear(messageId) {
        viewers.delete(messageId);
      },

      clearAll() {
        viewers.clear();
      }
    };
  },

  onUnload() {
    viewers.clear();
    delete globalThis.RevengeMessageViewers;

    logger.log("[Message Viewers] Unloaded");
  }
};