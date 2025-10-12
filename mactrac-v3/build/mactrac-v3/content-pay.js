// content.js
class ExtensionUsageManager {
  constructor() {
    this.userStatus = null
    this.usageData = null
    this.listeners = new Set()

    this.loadUserStatus()
  }

  async loadUserStatus() {
    const response = await chrome.runtime.sendMessage({
      type: 'GET_USER_STATUS',
    })
    this.userStatus = response.status
  }

  // Check if user can use the feature
  async canUseFeature() {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'CHECK_USAGE_LIMIT',
      })

      const canuseFeature = response.success && response.canUse
      const notPaid = !response.unlimited
      if (canuseFeature && notPaid) {
        await chrome.runtime.sendMessage({
          type: 'INCREMENT_USAGE',
        })
      }
      if (canuseFeature) return true
      return false
    } catch (error) {
      console.error('Failed to check usage limit:', error)
      return false
    }
  }

  getUserStatus() {
    return this.userStatus
  }

  isPaid() {
    return this.userStatus && this.userStatus.paid
  }

  hasActiveSubscription() {
    return (
      this.userStatus && this.userStatus.paid && this.userStatus.subscriptionStatus === 'active'
    )
  }

  // Open payment page
  async openPaymentPage() {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'OPEN_PAYMENT_PAGE',
      })

      return response.success
    } catch (error) {
      console.error('Failed to open payment page:', error)
      return false
    }
  }

  // Force refresh subscription status
  async refreshSubscriptionStatus() {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'CHECK_SUBSCRIPTION_STATUS',
      })

      if (response.success) {
        this.userStatus = response.status
      }

      return response.success
    } catch (error) {
      console.error('Failed to refresh status:', error)
      return false
    }
  }

  // Show upgrade prompt
  showUpgradePrompt(message = 'Upgrade to unlimited usage!') {
    const shouldUpgrade = confirm(`${message}\n\nWould you like to upgrade now?`)

    if (shouldUpgrade) {
      this.openPaymentPage()
    }

    return shouldUpgrade
  }

  async handleFeatureRequest() {
    try {
      const canUse = await this.canUseFeature()
      if (canUse) {
        return { success: true, unlimited: true }
      } else {
        const choice = await this.showUpgradePrompt(
          `You've reached your daily limit of 5 uses for scanning.`,
        )

        return {
          success: false,
          limitReached: true,
          action: choice,
        }
      }
    } catch (error) {
      console.error(`Failed to handle scanning request:`, error)
      return { success: false, error: error.message }
    }
  }
}

window.extensionUsage = new ExtensionUsageManager()
