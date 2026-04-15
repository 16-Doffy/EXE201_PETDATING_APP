import { apiRequest } from './api';

export enum SubscriptionPlan {
  FREE = 'FREE',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export interface SubscriptionResponse {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface UpgradeSubscriptionRequest {
  planName: string;
}

export const subscriptionService = {
  async createSubscription(planName: string): Promise<SubscriptionResponse> {
    return apiRequest('/subscriptions', {
      method: 'POST',
      body: { planName },
    });
  },

  async getActiveSubscription(): Promise<SubscriptionResponse | null> {
    try {
      return await apiRequest('/subscriptions', {
        method: 'GET',
      });
    } catch {
      return null;
    }
  },

  async upgradeSubscription(planName: string): Promise<SubscriptionResponse> {
    return apiRequest('/subscriptions/upgrade', {
      method: 'PUT',
      body: { planName },
    });
  },

  async hasFeature(feature: string): Promise<boolean> {
    try {
      return await apiRequest(`/subscriptions/has-feature/${feature}`, {
        method: 'GET',
      });
    } catch {
      return false;
    }
  },

  async getSubscriptionStatus(): Promise<{
    isActive: boolean;
    plan?: SubscriptionPlan;
    daysRemaining?: number;
  }> {
    const subscription = await this.getActiveSubscription();
    if (!subscription) {
      return { isActive: false };
    }

    const endDate = new Date(subscription.endDate);
    const now = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      isActive: subscription.isActive && daysRemaining > 0,
      plan: subscription.plan,
      daysRemaining: Math.max(0, daysRemaining),
    };
  },
};
