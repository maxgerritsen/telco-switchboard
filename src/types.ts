export const PlanType = {
    INTERNET_TV: 'INTERNET_TV',
    MOBILE: 'MOBILE',
} as const;

export type PlanType = (typeof PlanType)[keyof typeof PlanType];

export interface Promotion {
    id: string;
    durationMonths: number | undefined;
    discountedPrice: number | undefined;
    label: string;
}

export interface DeviceCost {
    hasDevice: boolean;
    upfrontCost: number | undefined;
    monthlyCredit: number | undefined;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    type: PlanType;
    basePrice: number | undefined;
    contractDuration: number | undefined;
    promotions: Promotion[];
    deviceDetails?: DeviceCost;
}

export interface MobilePerson {
    id: string;
    name: string;
    currentPlan: SubscriptionPlan;
    newPlan: SubscriptionPlan;
}

export interface ComparisonState {
    internet: {
        current: SubscriptionPlan;
        new: SubscriptionPlan;
    } | null;

    mobilePeople: MobilePerson[];

    startDate: Date;

    addInternetPlan: () => void;
    removeInternetPlan: () => void;
    updateInternetPlan: (type: 'current' | 'new', plan: Partial<SubscriptionPlan>) => void;
    addMobilePerson: () => void;
    removeMobilePerson: (id: string) => void;
    updateMobilePlan: (personId: string, type: 'current' | 'new', plan: Partial<SubscriptionPlan>) => void;
    updateMobilePersonName: (personId: string, name: string) => void;
    setDemoState: () => void;
    resetState: () => void;
}
