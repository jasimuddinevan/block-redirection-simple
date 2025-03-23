// Manage website-specific settings
const settings = {
  // Get list of blocked websites
  getBlockedSites: async () => {
    const result = await chrome.storage.local.get(['blockedSites']);
    return result.blockedSites || [];
  },

  // Add a new website to blocked list
  addBlockedSite: async (url) => {
    try {
      const hostname = new URL(url).hostname;
      const blockedSites = await settings.getBlockedSites();
      if (!blockedSites.includes(hostname)) {
        blockedSites.push(hostname);
        await chrome.storage.local.set({ blockedSites });
        return { success: true, hostname };
      }
      return { success: false, error: 'Site already blocked' };
    } catch (error) {
      return { success: false, error: 'Invalid URL' };
    }
  },

  // Remove website from blocked list
  removeBlockedSite: async (hostname) => {
    const blockedSites = await settings.getBlockedSites();
    const updatedSites = blockedSites.filter(site => site !== hostname);
    await chrome.storage.local.set({ blockedSites: updatedSites });
    return { success: true };
  },

  // Check if a website is in blocked list
  isBlocked: async (hostname) => {
    const blockedSites = await settings.getBlockedSites();
    return blockedSites.includes(hostname);
  }
};