// content.js
class ExtensionUsageManager {
	constructor() {
		this.userStatus = null;
		this.usageData = null;
		this.listeners = new Set();

		this.init();
	}

	async init() {
		// Load initial status
		await this.loadUserStatus();

		// Listen for background script messages
		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			this.handleBackgroundMessage(request, sender, sendResponse);
		});

		console.log("ExtensionUsageManager initialized");
	}

	async loadUserStatus() {
		try {
			const response = await chrome.runtime.sendMessage({
				type: "GET_USER_STATUS",
			});

			if (response.success) {
				this.userStatus = response.status;
				this.notifyListeners("statusUpdate", this.userStatus);
			}
		} catch (error) {
			console.error("Failed to load user status:", error);
		}
	}

	handleBackgroundMessage(request, sender, sendResponse) {
		switch (request.type) {
			case "SUBSCRIPTION_STATUS_UPDATE":
				this.userStatus = request.data;
				this.notifyListeners("statusUpdate", this.userStatus);
				break;

			case "DAILY_USAGE_RESET":
				this.usageData = request.data;
				this.notifyListeners("usageReset", this.usageData);
				break;
		}
	}

	// Add event listener
	addEventListener(event, callback) {
		this.listeners.add({ event, callback });
	}

	// Remove event listener
	removeEventListener(event, callback) {
		this.listeners.forEach((listener) => {
			if (listener.event === event && listener.callback === callback) {
				this.listeners.delete(listener);
			}
		});
	}

	// Notify all listeners
	notifyListeners(event, data) {
		this.listeners.forEach((listener) => {
			if (listener.event === event) {
				try {
					listener.callback(data);
				} catch (error) {
					console.error("Error in event listener:", error);
				}
			}
		});
	}

	// Check if user can use the feature
	async canUseFeature() {
		try {
			const response = await chrome.runtime.sendMessage({
				type: "CHECK_USAGE_LIMIT",
			});

			return response.success && response.canUse;
		} catch (error) {
			console.error("Failed to check usage limit:", error);
			return false;
		}
	}

	// Use the feature (increments usage counter)
	async useFeature() {
		try {
			// First check if can use
			const canUse = await this.canUseFeature();
			if (!canUse) {
				throw new Error("Feature usage limit reached");
			}

			// Increment usage
			const response = await chrome.runtime.sendMessage({
				type: "INCREMENT_USAGE",
			});

			if (!response.success) {
				throw new Error(response.error || "Failed to use feature");
			}

			// Notify listeners about usage
			this.notifyListeners("featureUsed", response);

			return response;
		} catch (error) {
			console.error("Failed to use feature:", error);
			throw error;
		}
	}

	// Get current user status
	getUserStatus() {
		return this.userStatus;
	}

	// Check if user is subscribed/paid
	isPaid() {
		return this.userStatus && this.userStatus.paid;
	}

	// Check if user has active subscription
	hasActiveSubscription() {
		return (
			this.userStatus &&
			this.userStatus.paid &&
			this.userStatus.subscriptionStatus === "active"
		);
	}

	// Open payment page
	async openPaymentPage() {
		try {
			const response = await chrome.runtime.sendMessage({
				type: "OPEN_PAYMENT_PAGE",
			});

			return response.success;
		} catch (error) {
			console.error("Failed to open payment page:", error);
			return false;
		}
	}

	// Force refresh subscription status
	async refreshStatus() {
		try {
			const response = await chrome.runtime.sendMessage({
				type: "FORCE_STATUS_CHECK",
			});

			if (response.success) {
				this.userStatus = response.status;
				this.notifyListeners("statusUpdate", this.userStatus);
			}

			return response.success;
		} catch (error) {
			console.error("Failed to refresh status:", error);
			return false;
		}
	}

	// Show upgrade prompt
	showUpgradePrompt(message = "Upgrade to unlimited usage!") {
		const shouldUpgrade = confirm(
			`${message}\n\nWould you like to upgrade now?`
		);

		if (shouldUpgrade) {
			this.openPaymentPage();
		}

		return shouldUpgrade;
	}

	// Utility method to handle feature usage with automatic prompts
	async handleFeatureRequest(featureName = "this feature") {
		try {
			// If user is paid, allow unlimited usage
			if (this.isPaid()) {
				await this.useFeature();
				return { success: true, unlimited: true };
			}

			// Check for active trial - unlimited during trial
			// const trialStatus = await this.getTrialStatus();
			// if (trialStatus && trialStatus.isTrialActive) {
			// 	await this.useFeature();
			// 	return {
			// 		success: true,
			// 		trial: true,
			// 		unlimited: true,
			// 		trialDaysRemaining: trialStatus.remainingDays,
			// 	};
			// }

			// For non-paid users without active trial, check usage limits
			const canUse = await this.canUseFeature();
			if (!canUse) {
				// Show upgrade/trial prompt
				const choice = await this.showUpgradePrompt(
					`You've reached your daily limit of 5 uses for ${featureName}.`
				);

				return {
					success: false,
					limitReached: true,
					action: choice,
				};
			}

			// Use the feature
			const result = await this.useFeature();
			document.querySelector("#showUsageCount #count").innerText =
				result.remaining;
			// Show upgrade prompt if getting close to limit (only for non-trial users)
			if (!result.trial && result.remaining <= 1 && result.remaining > 0) {
				setTimeout(async () => {
					await this.showUpgradePrompt(
						`You have ${result.remaining} uses remaining today. Start a free trial for unlimited access!`
					);
				}, 1000); // Delay so user sees the feature worked first
			}

			return { success: true, ...result };
		} catch (error) {
			console.error(`Failed to handle ${featureName} request:`, error);
			return { success: false, error: error.message };
		}
	}
}

// Create global instance
window.extensionUsage = new ExtensionUsageManager();

// Example usage function that you can call from your extension
undefined_useExtensionFeature = async function (featureName = "feature") {
	return await window.extensionUsage.handleFeatureRequest(featureName);
};

// Export for modules if needed
if (typeof module !== "undefined" && module.exports) {
	module.exports = ExtensionUsageManager;
}
