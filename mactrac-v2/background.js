importScripts("ExtPay.js");
// background.js (MV3)
const API_BASE = "https://mactrac.onrender.com";
const CHAT_PATH = "/api/chat-completions";
const SCAN_MESSAGE_TYPE = "ANALYZE_CONTEXT";
const STORAGE_TOKEN_KEY = "mactrac_token_v1";

/* Extensionpay Logic Start */
const EXTENSION_ID = "mactrac124";
const DAILY_LIMIT = 5;
const extpay = ExtPay(EXTENSION_ID);

// Initialize ExtPay background
extpay.startBackground();

// Constants for usage tracking

const STORAGE_KEYS = {
	USER_STATUS: "user_status",
	LAST_CHECK: "last_subscription_check",
	USER_IDENTIFIER: "user_identifier",
};

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
	console.log("Extension installed, initializing...");
	initializeExtension();
});

// Initialize when extension starts
chrome.runtime.onStartup.addListener(() => {
	console.log("Extension started, checking subscription...");
	checkSubscriptionStatus();
});

async function initializeExtension() {
	try {
		// Check subscription status
		await checkSubscriptionStatus();

		// Set up periodic checks (every hour)
		
	} catch (error) {
		console.error("Failed to initialize extension:", error);
	}
}

async function checkSubscriptionStatus() {
	try {
		// Redeclare extpay for service worker context
		const extpay = ExtPay(EXTENSION_ID);
		const user = await extpay.getUser();

		const userStatus = {
			paid: user.paid,
			subscriptionStatus: user.subscriptionStatus || null,
			plan: user.plan || null,
			email: user.email || null,
			subscriptionCancelAt: user.subscriptionCancelAt || null,
			trialStartedAt: user.trialStartedAt || null,
			installedAt: user.installedAt || null,
			lastChecked: new Date().toISOString(),
		};

		// Store user status
		await chrome.storage.local.set({
			[STORAGE_KEYS.USER_STATUS]: userStatus,
			[STORAGE_KEYS.LAST_CHECK]: Date.now(),
		});

		console.log("Subscription status updated:", userStatus);

		// Notify content scripts about status change
		broadcastStatusUpdate(userStatus);
	} catch (error) {
		console.error("Failed to check subscription status:", error);

		// Store error state
		await chrome.storage.local.set({
			[STORAGE_KEYS.USER_STATUS]: {
				paid: false,
				error: true,
				errorMessage: error.message,
				lastChecked: new Date().toISOString(),
			},
		});
	}
}

function broadcastStatusUpdate(userStatus) {
	// Broadcast to all content scripts
	chrome.tabs.query({}, (tabs) => {
		tabs.forEach((tab) => {
			chrome.tabs
				.sendMessage(tab.id, {
					type: "SUBSCRIPTION_STATUS_UPDATE",
					data: userStatus,
				})
				.catch(() => {
					// Ignore errors for tabs without content scripts
				});
		});
	});
}

// Handle alarms

const TRIAL_DAYS = 7;
async function checkUsageLimit() {
	try {
		// Always fetch fresh user data from ExtPay servers
		const extpay = ExtPay(EXTENSION_ID);
		const user = await extpay.getUser();

		// If user is paid, unlimited usage
		if (user.paid) {
			return true;
		}

		// Check if user has an active trial
		// if (user.trialStartedAt) {
		// 	const now = new Date();
		// 	const trialStart = new Date(user.trialStartedAt);
		// 	const trialDuration = TRIAL_DAYS * 24 * 60 * 60 * 1000; // in milliseconds

		// 	if (now - trialStart < trialDuration) {
		// 		return true; // Trial is still active
		// 	}
		// }

		// For free users, check daily usage limits
		const userIdentifier = await getUserIdentifier(user);
		const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
		const usageKey = `usage_${userIdentifier}_${today}`;

		// Get usage from local storage
		const usageResult = await chrome.storage.local.get([usageKey]);
		const currentUsage = usageResult[usageKey] || 0;

		return {
			success: true,
			canUse: currentUsage < DAILY_LIMIT,
			count: currentUsage,
			limit: DAILY_LIMIT,
			remaining: DAILY_LIMIT - currentUsage,
		};
	} catch (error) {
		console.error("Error checking usage limit:", error);
		// On error, default to not allowing usage for security
		return { success: false, canUse: false, error: error.message };
	}
}

async function incrementUsage() {
	try {
		// Always fetch fresh user data from ExtPay servers
		const extpay = ExtPay(EXTENSION_ID);
		const user = await extpay.getUser();

		// If user is paid, don't increment usage (unlimited)
		if (user.paid) {
			return { success: true, unlimited: true };
		}

		// // Check if user has an active trial - unlimited usage during trial
		// if (user.trialStartedAt) {
		// 	const now = new Date();
		// 	const trialStart = new Date(user.trialStartedAt);
		// 	const trialDuration = TRIAL_DAYS * 24 * 60 * 60 * 1000;

		// 	if (now - trialStart < trialDuration) {
		// 		const remainingTime = trialDuration - (now - trialStart);
		// 		const remainingDays = Math.ceil(remainingTime / (24 * 60 * 60 * 1000));
		// 		return {
		// 			success: true,
		// 			trial: true,
		// 			unlimited: true,
		// 			trialDaysRemaining: remainingDays,
		// 		};
		// 	}
		// }

		// For non-paid users WITHOUT active trial, track usage with user identifier
		const userIdentifier = await getUserIdentifier(user);
		const today = new Date().toISOString().split("T")[0];
		const usageKey = `usage_${userIdentifier}_${today}`;

		// Get current usage
		const usageResult = await chrome.storage.local.get([usageKey]);
		const currentUsage = usageResult[usageKey] || 0;

		// Check if already at limit
		if (currentUsage >= DAILY_LIMIT) {
			return {
				success: false,
				error: "Daily limit reached",
				count: currentUsage,
				limit: DAILY_LIMIT,
				remaining: 0,
			};
		}

		// Increment usage
		const newCount = currentUsage + 1;
		await chrome.storage.local.set({
			[usageKey]: newCount,
		});

		return {
			success: true,
			count: newCount,
			limit: DAILY_LIMIT,
			remaining: DAILY_LIMIT - newCount,
		};
	} catch (error) {
		console.error("Error incrementing usage:", error);
		return {
			success: false,
			error: error.message,
		};
	}
}

async function getUserIdentifier(user) {
	try {
		// Create a semi-persistent identifier based on user data
		let identifier = "anonymous";

		if (user.email) {
			// Use email if available (most reliable)
			identifier = btoa(user.email).substring(0, 16);
		} else if (user.installedAt) {
			// Use installation date + browser info as fallback
			const browserInfo = navigator.userAgent.substring(0, 50);
			identifier = btoa(user.installedAt.toString() + browserInfo).substring(
				0,
				16
			);
		} else {
			// Fallback: create and store a pseudo-random ID
			const stored = await chrome.storage.local.get([
				STORAGE_KEYS.USER_IDENTIFIER,
			]);
			if (stored[STORAGE_KEYS.USER_IDENTIFIER]) {
				identifier = stored[STORAGE_KEYS.USER_IDENTIFIER];
			} else {
				identifier = btoa(
					Math.random().toString() + Date.now().toString()
				).substring(0, 16);
				await chrome.storage.local.set({
					[STORAGE_KEYS.USER_IDENTIFIER]: identifier,
				});
			}
		}

		return identifier;
	} catch (error) {
		console.error("Error creating user identifier:", error);
		return "fallback_" + Math.random().toString(36).substring(2, 10);
	}
}

async function getUserStatus() {
	const result = await chrome.storage.local.get([STORAGE_KEYS.USER_STATUS]);
	return result[STORAGE_KEYS.USER_STATUS] || null;
}

async function openPaymentPage() {
	const extpay = ExtPay(EXTENSION_ID);
	await extpay.openPaymentPage();
}

async function openTrialPage() {
	const extpay = ExtPay(EXTENSION_ID);
	await extpay.openTrialPage("7-day"); // 7-day trial
}

async function checkTrialStatus() {
	try {
		const extpay = ExtPay(EXTENSION_ID);
		const user = await extpay.getUser();

		if (!user.trialStartedAt) {
			return {
				hasTrialStarted: false,
				canStartTrial: true,
				isTrialActive: false,
				remainingDays: 0,
			};
		}

		const now = new Date();
		const trialStart = new Date(user.trialStartedAt);
		const trialDuration = TRIAL_DAYS * 24 * 60 * 60 * 1000;
		const trialEnd = new Date(trialStart.getTime() + trialDuration);

		const isActive = now < trialEnd;
		const remainingTime = isActive ? trialEnd - now : 0;
		const remainingDays = isActive
			? Math.ceil(remainingTime / (24 * 60 * 60 * 1000))
			: 0;

		return {
			hasTrialStarted: true,
			isTrialActive: isActive,
			trialStartedAt: user.trialStartedAt,
			trialEndDate: trialEnd.toISOString(),
			remainingDays: remainingDays,
			canStartTrial: false,
		};
	} catch (error) {
		console.error("Error checking trial status:", error);
		return {
			hasTrialStarted: false,
			canStartTrial: true,
			isTrialActive: false,
			remainingDays: 0,
			error: error.message,
		};
	}
}

// Listen for when user pays or starts trial
extpay.onPaid.addListener((user) => {
	console.log("User paid!", user);
	checkSubscriptionStatus(); // Refresh status immediately
});

// Listen for when user starts trial (requires content script setup)
try {
	extpay.onTrialStarted.addListener((user) => {
		console.log("User started trial!", user);
		checkSubscriptionStatus(); // Refresh status immediately
	});
} catch (error) {
	console.log("onTrialStarted not available - content script required");
}

/* Extensiopay Logic End */

function unwrapOpenAI(data) {
	const choice = data?.choices?.[0];
	let text = choice?.message?.content ?? choice?.delta?.content ?? null;
	if (typeof text !== "string") return data;
	text = text.trim();
	if (text.startsWith("```")) {
		text = text
			.replace(/^```[a-zA-Z]*\s*/, "")
			.replace(/```$/, "")
			.trim();
	}
	try {
		return JSON.parse(text);
	} catch {}
	const cleaned = text
		.replace(/[\u2018\u2019]/g, "'")
		.replace(/[\u201C\u201D]/g, '"')
		.replace(/,\s*([}\]])/g, "$1");
	try {
		console.log(JSON.parse(cleaned));
		return JSON.parse(cleaned);
	} catch {}
	const m = cleaned.match(/\{[\s\S]*\}/m);
	if (m) {
		try {
			return JSON.parse(m[0]);
		} catch {}
	}
	return data;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	handleMessage(request, sender, sendResponse);
	return true; // Keep message channel open for async response
});

async function handleMessage(request, sender, sendResponse) {
	try {
		switch (request.type) {
			case "CHECK_USAGE_LIMIT":
				const usageData = await checkUsageLimit();
				sendResponse(usageData);
				break;

			case "INCREMENT_USAGE":
				const result = await incrementUsage();
				sendResponse(result);
				break;

			case "GET_USER_STATUS":
				const status = await getUserStatus();
				sendResponse({ success: true, status });
				break;

			case "OPEN_PAYMENT_PAGE":
				await openPaymentPage();
				sendResponse({ success: true });
				break;

			case "OPEN_TRIAL_PAGE":
				await openTrialPage();
				sendResponse({ success: true });
				break;

			case "CHECK_TRIAL_STATUS":
				const trialStatus = await checkTrialStatus();
				sendResponse({ success: true, trialStatus });
				break;

			case "FORCE_STATUS_CHECK":
				await checkSubscriptionStatus();
				const newStatus = await getUserStatus();
				sendResponse({ success: true, status: newStatus });
				break;

			case SCAN_MESSAGE_TYPE:
				try {
					const { [STORAGE_TOKEN_KEY]: token } = await chrome.storage.local.get(
						[STORAGE_TOKEN_KEY]
					);

					// Include tab URL if not provided (helps your server logs)
					const payload = { ...request.payload };
					if (!payload.url && sender?.tab?.url) payload.url = sender.tab.url;

					const controller = new AbortController();
					const timeout = setTimeout(() => controller.abort("timeout"), 45000);

					const r = await fetch(`${API_BASE}${CHAT_PATH}`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							...(token ? { Authorization: `Bearer ${token}` } : {}),
						},
						body: JSON.stringify(payload),
						signal: controller.signal,
					});

					clearTimeout(timeout);

					if (r.status === 401) {
						try {
							chrome.tabs.sendMessage(sender?.tab?.id || 0, {
								type: "REAUTH_REQUIRED",
							});
						} catch {}
						return sendResponse({ error: "auth" });
					}

					const data = await r.json().catch(() => ({}));
					const result = unwrapOpenAI(data);
					return sendResponse({ result });
				} catch (e) {
					return sendResponse({ error: String(e?.message || e) });
				}

			default:
				sendResponse({ success: false, error: "Unknown message type" });
		}
	} catch (error) {
		console.error("Error handling message:", error);
		sendResponse({ success: false, error: error.message });
	}
}
