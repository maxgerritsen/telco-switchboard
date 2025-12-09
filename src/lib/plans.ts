import { type DeviceCost, type MobilePerson, PlanType, type SubscriptionPlan } from '@/types.ts';
import { v4 as uuidv4 } from 'uuid';

export const createEmptyDeviceDetails = (): DeviceCost => ({
    hasDevice: false,
    upfrontCost: undefined,
    monthlyCredit: undefined,
});

export const createEmptyPlan = (type: PlanType, label: string): SubscriptionPlan => ({
    id: uuidv4(),
    name: label,
    type,
    basePrice: undefined,
    contractDuration: undefined,
    promotions: [],
    deviceDetails: type === PlanType.MOBILE ? createEmptyDeviceDetails() : undefined,
});

export const createNewMobilePerson = (id: string, name: string): MobilePerson => ({
    id,
    name,
    currentPlan: createEmptyPlan(PlanType.MOBILE, 'Current Plan'),
    newPlan: createEmptyPlan(PlanType.MOBILE, 'New Offer'),
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

    if (plan.deviceDetails?.hasDevice) {
        if (plan.deviceDetails.upfrontCost === undefined || plan.deviceDetails.monthlyCredit === undefined) {
            return false;
        }
    }

    return true;
};

export const calculatePlanCost = (plan: SubscriptionPlan, months: number): number | null => {
    if (!isPlanComplete(plan)) return null;

    let totalCost = 0;

    if (plan.deviceDetails?.hasDevice) {
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
        if (plan.deviceDetails?.hasDevice && i < creditDuration) {
            monthlyCost += plan.deviceDetails.monthlyCredit!;
        }

        totalCost += monthlyCost;
    }

    return totalCost;
};
