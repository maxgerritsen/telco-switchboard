import { useComparisonStore } from '@/store/useStore.ts';
import { useTimelineDuration } from '@/hooks/useTimelineDuration.ts';
import { calculatePlanCost } from '@/lib/plans.ts';
import { useMemo } from 'react';
import type { SubscriptionPlan } from '@/types.ts';

export interface CostSnapshot {
    current: number | null;
    new: number | null;
    delta: number | null;
}

export interface ComparisonMetrics {
    internet: CostSnapshot;
    mobile: CostSnapshot;
    total: CostSnapshot;
}

export const useComparisonCalculations = () => {
    const { internet, mobilePeople } = useComparisonStore();
    const maxDuration = useTimelineDuration();

    const getSnapshot = (months: number, type: 'internet' | 'mobile' | 'total'): CostSnapshot => {
        let currentTotal = 0;
        let newTotal = 0;
        let validCurrent = true;
        let validNew = true;

        const addCost = (side: 'current' | 'new', plan: SubscriptionPlan) => {
            const cost = calculatePlanCost(plan, months);
            if (cost === null) {
                if (side === 'current') validCurrent = false;
                else validNew = false;
                return 0;
            }
            return cost;
        };

        if (type === 'internet' || type === 'total') {
            if (internet) {
                currentTotal += addCost('current', internet.current);
                newTotal += addCost('new', internet.new);
            }
        }

        if (type === 'mobile' || type === 'total') {
            mobilePeople.forEach((p) => {
                currentTotal += addCost('current', p.currentPlan);
                newTotal += addCost('new', p.newPlan);
            });
        }

        const current = validCurrent ? currentTotal : null;
        const new_ = validNew ? newTotal : null; // 'new' is reserved keyword

        return {
            current,
            new: new_,
            delta: current !== null && new_ !== null ? new_ - current : null,
        };
    };

    const metricsAtEnd = useMemo(
        () => ({
            internet: getSnapshot(maxDuration, 'internet'),
            mobile: getSnapshot(maxDuration, 'mobile'),
            total: getSnapshot(maxDuration, 'total'),
        }),
        [internet, mobilePeople, maxDuration],
    );

    const metricsAt1Year = useMemo(
        () => ({
            total: getSnapshot(maxDuration + 12, 'total'),
            mobile: getSnapshot(maxDuration + 12, 'mobile'),
        }),
        [internet, mobilePeople, maxDuration],
    );

    const metricsAt2Years = useMemo(
        () => ({
            total: getSnapshot(maxDuration + 24, 'total'),
            mobile: getSnapshot(maxDuration + 24, 'mobile'),
        }),
        [internet, mobilePeople, maxDuration],
    );

    const hasData = (internet && (internet.current.basePrice || 0) > 0) || mobilePeople.length > 0;

    return {
        maxDuration,
        hasData,
        metricsAtEnd,
        metricsAt1Year,
        metricsAt2Years,
    };
};
