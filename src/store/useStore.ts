import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import LZString from 'lz-string';
import { type ComparisonState } from '@/types.ts';
import { createEmptyPlan, createNewMobilePerson } from '@/lib/plans.ts';
import { generateDemoData } from '@/store/demoData.ts';
import { createId } from '@/lib/utils.ts';
import { minify, unminify } from '@/store/jsonMinifier.ts';

export const getShareableUrl = () => {
    const state = useComparisonStore.getState();
    const minified = minify({
        internet: state.internet,
        mobilePeople: state.mobilePeople,
    });
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(minified));

    const url = new URL(window.location.href);
    url.hash = compressed;
    return url.toString();
};

export const loadFromUrl = () => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const payload = new URLSearchParams(hash).get('s') || hash;
    const decompressed = LZString.decompressFromEncodedURIComponent(payload);
    if (!decompressed) return;

    const json = JSON.parse(decompressed);
    const fullState = unminify(json.state ?? json) as ComparisonState;

    useComparisonStore.setState({
        internet: fullState.internet ?? null,
        mobilePeople: fullState.mobilePeople ?? [],
    });

    // Clean the URL so the user sees a clean address bar
    window.history.replaceState(null, '', ' ');
};

export const useComparisonStore = create<ComparisonState>()(
    persist(
        (set) => ({
            internet: null,
            mobilePeople: [],

            addInternetPlan: () =>
                set(() => ({
                    internet: {
                        current: createEmptyPlan(),
                        new: createEmptyPlan(),
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
                        createNewMobilePerson(createId(), `Person ${state.mobilePeople.length + 1}`),
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
            storage: createJSONStorage(() => localStorage),
            version: 2,
            migrate: (persistedState: unknown, version) => {
                if (version === 1) {
                    return unminify(persistedState) as ComparisonState;
                }
                return persistedState as ComparisonState;
            },
        },
    ),
);
