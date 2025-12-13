import { type DeviceDetails, type MobilePerson, PlanType, type SubscriptionPlan } from '@/types.ts';
import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_INTERNET_NAME_CURRENT = 'Huidig Internet & TV';
export const DEFAULT_INTERNET_NAME_NEW = 'Nieuw Internet & TV';
export const DEFAULT_MOBILE_NAME_CURRENT = 'Current Plan';
export const DEFAULT_MOBILE_NAME_NEW = 'New Offer';

export const createEmptyDeviceDetails = (): DeviceDetails => ({
    upfrontCost: undefined,
    monthlyCredit: undefined,
});

export const createEmptyPlan = (type: PlanType, label?: string): SubscriptionPlan => ({
    id: uuidv4(),
    name: label,
    type,
    basePrice: undefined,
    contractDuration: undefined,
    promotions: [],
    deviceDetails: undefined,
});

export const createNewMobilePerson = (id: string, name: string): MobilePerson => ({
    id,
    name,
    currentPlan: createEmptyPlan(PlanType.MOBILE, DEFAULT_MOBILE_NAME_CURRENT),
    newPlan: createEmptyPlan(PlanType.MOBILE, DEFAULT_MOBILE_NAME_NEW),
});

export const isPlanComplete = (plan: SubscriptionPlan): boolean => {
    if (plan.basePrice === undefined || plan.contractDuration === undefined) {
        return false;
    }

    if (
        plan.promotions.some(
            (p) => p.durationMonths === undefined || p.durationMonths <= 0 || p.discountedPrice === undefined,
        )
    ) {
        return false;
    }

    if (plan.deviceDetails) {
        if (plan.deviceDetails.upfrontCost === undefined || plan.deviceDetails.monthlyCredit === undefined) {
            return false;
        }
    }

    return true;
};

export const calculatePlanCost = (plan: SubscriptionPlan, months: number): number | null => {
    if (!isPlanComplete(plan)) return null;

    let totalCost = 0;

    if (plan.deviceDetails) {
        totalCost += plan.deviceDetails.upfrontCost!;
    }

    for (let i = 0; i < months; i++) {
        let monthlyCost = plan.basePrice!;

        let coveredMonths = 0;

        for (const promo of plan.promotions) {
            const duration = promo.durationMonths!;
            if (i >= coveredMonths && i < coveredMonths + duration) {
                monthlyCost = promo.discountedPrice!;
                break;
            }
            coveredMonths += duration;
        }

        const creditDuration = plan.contractDuration ?? 0;
        if (plan.deviceDetails && i < creditDuration) {
            monthlyCost += plan.deviceDetails.monthlyCredit!;
        }

        totalCost += monthlyCost;
    }

    return totalCost;
};
