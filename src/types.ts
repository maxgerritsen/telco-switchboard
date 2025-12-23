export interface Promotion {
    id: string;
    durationMonths: number | undefined;
    discountedPrice: number | undefined;
}

export interface DeviceDetails {
    upfrontCost: number | undefined;
    monthlyCredit: number | undefined;
}

export interface SubscriptionPlan {
    id: string;
    basePrice: number | undefined;
    contractDuration: number | undefined;
    promotions: Promotion[];
    deviceDetails?: DeviceDetails;
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
