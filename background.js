let isEnabled = false;
const RULE_ID = 1;

// Create rule for blocking redirects
const createRedirectRule = (hostname) => ({
  id: RULE_ID,
  priority: 1,
  action: { type: 'block' },
  condition: {
    urlFilter: `||${hostname}/*`,
    resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest'],
    responseHeaders: [{
      header: 'location',
      contains: ''
    }],
    statusCodes: [301, 302, 303, 307, 308]
  }
});

// Update blocking rules based on current state and blocked sites
async function updateBlockingRules() {
  if (!isEnabled) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [RULE_ID]
    });
    return;
  }

  const { blockedSites = [] } = await chrome.storage.local.get(['blockedSites']);
  if (blockedSites.length === 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [RULE_ID]
    });
    return;
  }

  // Create rules for each blocked site
  const rules = blockedSites.map((hostname, index) => ({
    ...createRedirectRule(hostname),
    id: RULE_ID + index
  }));

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: Array.from({ length: blockedSites.length }, (_, i) => RULE_ID + i),
    addRules: rules
  });
}

// Listen for changes in blocking state
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleRedirectBlocking') {
    isEnabled = message.isEnabled;
    updateBlockingRules();
  }
});

// Listen for changes in blocked sites list
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.blockedSites) {
    updateBlockingRules();
  }
});

// Initialize state from storage
chrome.storage.local.get(['isEnabled', 'blockedSites'], (result) => {
  isEnabled = result.isEnabled || false;
  if (isEnabled) {
    updateBlockingRules();
  }
});