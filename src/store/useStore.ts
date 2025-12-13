import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import LZString from 'lz-string';
import { type ComparisonState, PlanType } from '@/types.ts';
import {
    createEmptyPlan,
    createNewMobilePerson,
    DEFAULT_INTERNET_NAME_CURRENT,
    DEFAULT_INTERNET_NAME_NEW,
} from '@/lib/plans.ts';
import { v4 as uuidv4 } from 'uuid';
import { generateDemoData } from '@/store/demoData.ts';

const hashStorage: StateStorage = {
    getItem: (key): string | null => {
        const searchParams = new URLSearchParams(location.hash.slice(1));
        const storedValue = searchParams.get(key);
        return storedValue ? LZString.decompressFromEncodedURIComponent(storedValue) : null;
    },
    setItem: (key, newValue): void => {
        const searchParams = new URLSearchParams(location.hash.slice(1));
        const compressed = LZString.compressToEncodedURIComponent(newValue);
        searchParams.set(key, compressed);
        location.hash = searchParams.toString();
    },
    removeItem: (key): void => {
        const searchParams = new URLSearchParams(location.hash.slice(1));
        searchParams.delete(key);
        location.hash = searchParams.toString();
    },
};

export const useComparisonStore = create<ComparisonState>()(
    persist(
        (set) => ({
            internet: null,
            mobilePeople: [],

            addInternetPlan: () =>
                set(() => ({
                    internet: {
                        current: createEmptyPlan(PlanType.INTERNET_TV, DEFAULT_INTERNET_NAME_CURRENT),
                        new: createEmptyPlan(PlanType.INTERNET_TV, DEFAULT_INTERNET_NAME_NEW),
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
                        const planKey = type === 'current' ? 'currentPlan' : 'newPlan';
                        return {
                            ...person,
                            [planKey]: { ...person[planKey], ...planUpdates },
                        };
                    }),
                })),

            updateMobilePersonName: (personId, name) =>
                set((state) => ({
                    mobilePeople: state.mobilePeople.map((person) =>
                        person.id === personId ? { ...person, name } : person,
                    ),
                })),

            setDemoState: () => set(generateDemoData()),
            resetState: () => set({ internet: null, mobilePeople: [] }),
        }),
        {
            name: 's',
            storage: createJSONStorage(() => hashStorage),
            partialize: (state) => ({
                internet: state.internet,
                mobilePeople: state.mobilePeople,
            }),
        },
    ),
);
