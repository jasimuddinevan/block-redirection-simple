document.addEventListener('DOMContentLoaded', async () => {
  const toggleSwitch = document.getElementById('redirectToggle');
  const statusText = document.getElementById('statusText');
  const urlInput = document.getElementById('urlInput');
  const addButton = document.getElementById('addButton');
  const errorMessage = document.getElementById('errorMessage');
  const blockedSitesContainer = document.getElementById('blockedSites');

  // Load saved state
  chrome.storage.local.get(['isEnabled'], (result) => {
    toggleSwitch.checked = result.isEnabled || false;
    updateStatus(result.isEnabled);
  });

  // Handle toggle changes
  toggleSwitch.addEventListener('change', (e) => {
    const isEnabled = e.target.checked;
    chrome.storage.local.set({ isEnabled });
    updateStatus(isEnabled);
  });

  function updateStatus(isEnabled) {
    statusText.textContent = isEnabled ? 'Protection is on' : 'Protection is off';
    statusText.style.color = isEnabled ? '#2196F3' : '#666';
    chrome.runtime.sendMessage({ action: 'toggleRedirectBlocking', isEnabled });
  }

  // Load and display blocked sites
  async function loadBlockedSites() {
    const sites = await settings.getBlockedSites();
    blockedSitesContainer.innerHTML = '';
    
    sites.forEach(hostname => {
      const siteElement = document.createElement('div');
      siteElement.className = 'site-item';
      siteElement.innerHTML = `
        <span>${hostname}</span>
        <button class="delete-btn" data-hostname="${hostname}">Remove</button>
      `;
      blockedSitesContainer.appendChild(siteElement);
    });
  }

  // Add new website
  addButton.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) return;

    const result = await settings.addBlockedSite(url);
    if (result.success) {
      urlInput.value = '';
      errorMessage.style.display = 'none';
      await loadBlockedSites();
    } else {
      errorMessage.textContent = result.error;
      errorMessage.style.display = 'block';
    }
  });

  // Handle Enter key in input
  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addButton.click();
    }
  });

  // Handle site removal
  blockedSitesContainer.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const hostname = e.target.dataset.hostname;
      await settings.removeBlockedSite(hostname);
      await loadBlockedSites();
    }
  });

  // Initial load of blocked sites
  await loadBlockedSites();
});