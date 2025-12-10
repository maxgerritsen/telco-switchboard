import { create } from 'zustand';
import { type ComparisonState, PlanType } from '@/types.ts';
import { createEmptyPlan, createNewMobilePerson } from '@/lib/plans.ts';
import { v4 as uuidv4 } from 'uuid';
import { generateDemoData } from '@/store/demoData.ts';

export const useComparisonStore = create<ComparisonState>((set) => ({
    startDate: new Date(),

    internet: null,

    mobilePeople: [],

    addInternetPlan: () =>
        set(() => ({
            internet: {
                current: createEmptyPlan(PlanType.INTERNET_TV, 'Huidig Internet & TV'),
                new: createEmptyPlan(PlanType.INTERNET_TV, 'Nieuw Internet & TV'),
            },
        })),

    removeInternetPlan: () => set({ internet: null }),

    updateInternetPlan: (type, plan) =>
        set((state) => {
            if (!state.internet) return state;
            return {
                internet: {
                    ...state.internet,
                    [type]: { ...state.internet[type], ...plan },
                },
            };
        }),

    addMobilePerson: () =>
        set((state) => ({
            mobilePeople: [
                ...state.mobilePeople,
                createNewMobilePerson(uuidv4(), `Person ${state.mobilePeople.length + 1}`),
            ],
        })),

    removeMobilePerson: (id) =>
        set((state) => ({
            mobilePeople: state.mobilePeople.filter((p) => p.id !== id),
        })),

    updateMobilePlan: (personId, type, planUpdates) =>
        set((state) => ({
            mobilePeople: state.mobilePeople.map((person) => {
                if (person.id !== personId) return person;
                return {
                    ...person,
                    [type === 'current' ? 'currentPlan' : 'newPlan']: {
                        ...person[type === 'current' ? 'currentPlan' : 'newPlan'],
                        ...planUpdates,
                    },
                };
            }),
        })),

    updateMobilePersonName: (personId, name) =>
        set((state) => ({
            mobilePeople: state.mobilePeople.map((person) => (person.id === personId ? { ...person, name } : person)),
        })),

    setDemoState: () => {
        const demoData = generateDemoData();
        set(demoData);
    },

    resetState: () =>
        set(() => ({
            internet: null,
            mobilePeople: [],
        })),
}));
