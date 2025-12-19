import { createId } from '@/lib/utils.ts';

export const generateDemoData = () => {
    return {
        internet: {
            current: {
                id: createId(),
                basePrice: 72.5,
                contractDuration: 24,
                promotions: [
                    {
                        id: createId(),
                        durationMonths: 12,
                        discountedPrice: 36.25,
                    },
                ],
                deviceDetails: undefined,
            },
            new: {
                id: createId(),
                basePrice: 55.0,
                contractDuration: 24,
                promotions: [
                    {
                        id: createId(),
                        durationMonths: 1,
                        discountedPrice: 25.0,
                    },
                    {
                        id: createId(),
                        durationMonths: 9,
                        discountedPrice: 30.0,
                    },
                ],
                deviceDetails: undefined,
            },
        },
        mobilePeople: [
            {
                id: createId(),
                name: 'Persoon 1',
                currentPlan: {
                    id: createId(),
                    basePrice: 22.5,
                    contractDuration: 24,
                    promotions: [],
                    deviceDetails: {
                        upfrontCost: 89.9,
                        monthlyCredit: 40.0,
                    },
                },
                newPlan: {
                    id: createId(),
                    basePrice: 25.0,
                    contractDuration: 24,
                    promotions: [],
                    deviceDetails: {
                        upfrontCost: 185.9,
                        monthlyCredit: 41.5,
                    },
                },
            },
            {
                id: createId(),
                name: 'Persoon 2',
                currentPlan: {
                    id: createId(),
                    basePrice: 22.5,
                    contractDuration: 24,
                    promotions: [],
                    deviceDetails: {
                        upfrontCost: 89.9,
                        monthlyCredit: 40.0,
                    },
                },
                newPlan: {
                    id: createId(),
                    basePrice: 20.0,
                    contractDuration: 24,
                    promotions: [],
                    deviceDetails: {
                        upfrontCost: 185.9,
                        monthlyCredit: 41.5,
                    },
                },
            },
            {
                id: createId(),
                name: 'Persoon 3',
                currentPlan: {
                    id: createId(),
                    basePrice: 22.5,
                    contractDuration: 24,
                    promotions: [],
                    deviceDetails: undefined,
                },
                newPlan: {
                    id: createId(),
                    basePrice: 20.0,
                    contractDuration: 24,
                    promotions: [],
                    deviceDetails: undefined,
                },
            },
            {
                id: createId(),
                name: 'Persoon 4',
                currentPlan: {
                    id: createId(),
                    basePrice: 22.5,
                    contractDuration: 24,
                    promotions: [],
                    deviceDetails: undefined,
                },
                newPlan: {
                    id: createId(),
                    basePrice: 20.0,
                    contractDuration: 24,
                    promotions: [],
                    deviceDetails: undefined,
                },
            },
        ],
    };
};
