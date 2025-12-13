import { type DeviceDetails, type MobilePerson, PlanType, type SubscriptionPlan } from '@/types.ts';
import { createId } from '@/lib/utils.ts';

export const createEmptyDeviceDetails = (): DeviceDetails => ({
    upfrontCost: undefined,
    monthlyCredit: undefined,
});

export const createEmptyPlan = (type: PlanType): SubscriptionPlan => ({
    id: createId(),
    type,
    basePrice: undefined,
    contractDuration: undefined,
    promotions: [],
    deviceDetails: undefined,
});

export const createNewMobilePerson = (id: string, name: string): MobilePerson => ({
    id,
    name,
    currentPlan: createEmptyPlan(PlanType.MOBILE),
    newPlan: createEmptyPlan(PlanType.MOBILE),
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
