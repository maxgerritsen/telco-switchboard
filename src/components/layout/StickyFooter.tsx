import { useComparisonStore } from '@/store/useStore.ts';
import { useTimelineDuration } from '@/hooks/useTimelineDuration.ts';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';
import { calculatePlanCost } from '@/lib/plans.ts';

export const StickyFooter = () => {
    const [expanded, setExpanded] = useState(false);
    const { internet, mobilePeople } = useComparisonStore();
    const maxDuration = useTimelineDuration();

    const calculateTotalForSide = (side: 'current' | 'new', months: number): number | null => {
        let total = 0;
        let valid = true;

        if (internet) {
            const cost = calculatePlanCost(internet[side], months);
            if (cost === null) valid = false;
            else total += cost;
        }

        mobilePeople.forEach((person) => {
            const cost = calculatePlanCost(person[side === 'current' ? 'currentPlan' : 'newPlan'], months);
            if (cost === null) valid = false;
            else total += cost;
        });

        return valid ? total : null;
    };

    const calculateDelta = (months: number): number | null => {
        const currentTCO = calculateTotalForSide('current', months);
        const newTCO = calculateTotalForSide('new', months);

        if (currentTCO === null || newTCO === null) return null;
        return newTCO - currentTCO;
    };

    const deltaEnd = useMemo(() => calculateDelta(maxDuration), [internet, mobilePeople, maxDuration]);
    const delta1Year = useMemo(() => calculateDelta(maxDuration + 12), [internet, mobilePeople, maxDuration]);
    const delta2Years = useMemo(() => calculateDelta(maxDuration + 24), [internet, mobilePeople, maxDuration]);

    const formatCurrency = (val: number, minimumFractionDigits = 0) => {
        return new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits,
            maximumFractionDigits: 0,
        }).format(val);
    };

    const renderDelta = (delta: number | null, showPlus = true) => {
        if (delta === null) return <span className="text-gray-300">--</span>;

        // Negative delta means cost is lower (savings) -> Green
        // Positive delta means cost is higher (extra) -> Red
        const isSavings = delta < 0;
        const isNeutral = delta === 0;

        return (
            <span
                className={clsx(
                    'font-bold',
                    isNeutral ? 'text-gray-500' : isSavings ? 'text-green-500' : 'text-red-500',
                )}>
                {showPlus && delta > 0 ? '+' : ''}
                {formatCurrency(delta)}
            </span>
        );
    };

    const renderPrice = (price: number | null) => {
        if (price === null) return <span className="text-gray-300">--</span>;
        return <span className="text-gray-600 font-medium">{formatCurrency(price)}</span>;
    };

    const hasData = (internet && (internet.current.basePrice || 0) > 0) || mobilePeople.length > 0;

    const mobileTotalCurrent = useMemo(() => {
        let total = 0;
        let valid = true;
        mobilePeople.forEach((p) => {
            const cost = calculatePlanCost(p.currentPlan, maxDuration);
            if (cost === null) valid = false;
            else total += cost;
        });
        return valid ? total : null;
    }, [mobilePeople, maxDuration]);

    const mobileTotalNew = useMemo(() => {
        let total = 0;
        let valid = true;
        mobilePeople.forEach((p) => {
            const cost = calculatePlanCost(p.newPlan, maxDuration);
            if (cost === null) valid = false;
            else total += cost;
        });
        return valid ? total : null;
    }, [mobilePeople, maxDuration]);

    const totalCurrent = useMemo(() => {
        let total = 0;
        let valid = true;
        if (internet) {
            const cost = calculatePlanCost(internet.current, maxDuration);
            if (cost === null) valid = false;
            else total += cost;
        }
        if (mobileTotalCurrent === null) valid = false;
        else total += mobileTotalCurrent!;
        return valid ? total : null;
    }, [internet, mobileTotalCurrent, maxDuration]);

    const totalNew = useMemo(() => {
        let total = 0;
        let valid = true;
        if (internet) {
            const cost = calculatePlanCost(internet.new, maxDuration);
            if (cost === null) valid = false;
            else total += cost;
        }
        if (mobileTotalNew === null) valid = false;
        else total += mobileTotalNew!;
        return valid ? total : null;
    }, [internet, mobileTotalNew, maxDuration]);

    return (
        <Collapsible
            open={expanded}
            onOpenChange={setExpanded}
            className="fixed bottom-0 inset-x-0 z-40 flex flex-col justify-end">
            <CollapsibleContent className="bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="max-w-7xl mx-auto px-6 py-6 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="rounded-lg border border-gray-100 overflow-hidden shadow-sm bg-white">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700 w-1/4">
                                        Abonnement
                                    </th>
                                    <th className="px-6 py-4 text-right font-semibold text-gray-700">
                                        Huidig ({maxDuration} mnd)
                                    </th>
                                    <th className="px-6 py-4 text-right font-semibold text-gray-700">
                                        Nieuw ({maxDuration} mnd)
                                    </th>
                                    <th className="px-6 py-4 text-right font-semibold text-gray-700">
                                        Verschil ({maxDuration} mnd)
                                    </th>
                                    <th className="px-6 py-4 text-right font-semibold text-gray-700">
                                        Verschil (+1 jr)
                                    </th>
                                    <th className="px-6 py-4 text-right font-semibold text-gray-700">
                                        Verschil (+2 jr)
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {internet &&
                                    (() => {
                                        const currentCost = calculatePlanCost(internet.current, maxDuration);
                                        const newCost = calculatePlanCost(internet.new, maxDuration);

                                        const currentCost12 = calculatePlanCost(internet.current, maxDuration + 12);
                                        const newCost12 = calculatePlanCost(internet.new, maxDuration + 12);

                                        const currentCost24 = calculatePlanCost(internet.current, maxDuration + 24);
                                        const newCost24 = calculatePlanCost(internet.new, maxDuration + 24);

                                        return (
                                            <tr className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-gray-800">Internet & TV</td>
                                                <td className="px-6 py-4 text-right">{renderPrice(currentCost)}</td>
                                                <td className="px-6 py-4 text-right">{renderPrice(newCost)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    {renderDelta(
                                                        newCost !== null && currentCost !== null
                                                            ? newCost - currentCost
                                                            : null,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {renderDelta(
                                                        newCost12 !== null && currentCost12 !== null
                                                            ? newCost12 - currentCost12
                                                            : null,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {renderDelta(
                                                        newCost24 !== null && currentCost24 !== null
                                                            ? newCost24 - currentCost24
                                                            : null,
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })()}

                                {mobilePeople.length > 0 && (
                                    <>
                                        <tr className="bg-gray-50/30 font-semibold">
                                            <td className="px-6 py-4 text-gray-800">Mobiel (Totaal)</td>
                                            <td className="px-6 py-4 text-right">{renderPrice(mobileTotalCurrent)}</td>
                                            <td className="px-6 py-4 text-right">{renderPrice(mobileTotalNew)}</td>
                                            <td className="px-6 py-4 text-right">
                                                {renderDelta(
                                                    mobileTotalNew !== null && mobileTotalCurrent !== null
                                                        ? mobileTotalNew - mobileTotalCurrent
                                                        : null,
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right font-normal">
                                                {(() => {
                                                    let newTotal = 0;
                                                    let currentTotal = 0;
                                                    let valid = true;
                                                    mobilePeople.forEach((p) => {
                                                        const n = calculatePlanCost(p.newPlan, maxDuration + 12);
                                                        const c = calculatePlanCost(p.currentPlan, maxDuration + 12);
                                                        if (n === null || c === null) valid = false;
                                                        else {
                                                            newTotal += n;
                                                            currentTotal += c;
                                                        }
                                                    });
                                                    return renderDelta(valid ? newTotal - currentTotal : null);
                                                })()}
                                            </td>
                                            <td className="px-6 py-4 text-right font-normal">
                                                {(() => {
                                                    let newTotal = 0;
                                                    let currentTotal = 0;
                                                    let valid = true;
                                                    mobilePeople.forEach((p) => {
                                                        const n = calculatePlanCost(p.newPlan, maxDuration + 24);
                                                        const c = calculatePlanCost(p.currentPlan, maxDuration + 24);
                                                        if (n === null || c === null) valid = false;
                                                        else {
                                                            newTotal += n;
                                                            currentTotal += c;
                                                        }
                                                    });
                                                    return renderDelta(valid ? newTotal - currentTotal : null);
                                                })()}
                                            </td>
                                        </tr>

                                        {mobilePeople.map((person) => {
                                            const newCost = calculatePlanCost(person.newPlan, maxDuration);
                                            const currentCost = calculatePlanCost(person.currentPlan, maxDuration);

                                            const newCost12 = calculatePlanCost(person.newPlan, maxDuration + 12);
                                            const currentCost12 = calculatePlanCost(
                                                person.currentPlan,
                                                maxDuration + 12,
                                            );

                                            const newCost24 = calculatePlanCost(person.newPlan, maxDuration + 24);
                                            const currentCost24 = calculatePlanCost(
                                                person.currentPlan,
                                                maxDuration + 24,
                                            );

                                            return (
                                                <tr
                                                    key={person.id}
                                                    className="group hover:bg-gray-50/50 transition-colors text-gray-500">
                                                    <td className="px-6 py-3 pl-10">{person.name || 'Persoon'}</td>
                                                    <td className="px-6 py-3 text-right">{renderPrice(newCost)}</td>
                                                    <td className="px-6 py-3 text-right">{renderPrice(currentCost)}</td>
                                                    <td className="px-6 py-3 text-right">
                                                        {renderDelta(
                                                            newCost !== null && currentCost !== null
                                                                ? newCost - currentCost
                                                                : null,
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        {renderDelta(
                                                            newCost12 !== null && currentCost12 !== null
                                                                ? newCost12 - currentCost12
                                                                : null,
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        {renderDelta(
                                                            newCost24 !== null && currentCost24 !== null
                                                                ? newCost24 - currentCost24
                                                                : null,
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </>
                                )}
                            </tbody>
                            <tfoot className="bg-gray-50 border-t border-gray-200 font-bold">
                                <tr>
                                    <td className="px-6 py-4 text-gray-900">Totaal</td>
                                    <td className="px-6 py-4 text-right">{renderPrice(totalNew)}</td>
                                    <td className="px-6 py-4 text-right">{renderPrice(totalCurrent)}</td>
                                    <td className="px-6 py-4 text-right text-lg">{renderDelta(deltaEnd)}</td>
                                    <td className="px-6 py-4 text-right text-lg">{renderDelta(delta1Year)}</td>
                                    <td className="px-6 py-4 text-right text-lg">{renderDelta(delta2Years)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </CollapsibleContent>

            <div className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="flex gap-16 transition-opacity duration-300" style={{ opacity: expanded ? 0 : 1 }}>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                Verschil ({maxDuration} mnd)
                            </p>
                            <div className="text-3xl font-extrabold tracking-tight">
                                {hasData ? renderDelta(deltaEnd, false) : <span className="text-gray-300">--</span>}
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                1 jaar later
                            </p>
                            <div className="text-2xl font-bold tracking-tight">
                                {hasData ? renderDelta(delta1Year, false) : <span className="text-gray-300">--</span>}
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                2 jaar later
                            </p>
                            <div className="text-2xl font-bold tracking-tight">
                                {hasData ? renderDelta(delta2Years, false) : <span className="text-gray-300">--</span>}
                            </div>
                        </div>
                    </div>

                    <CollapsibleTrigger asChild>
                        <Button
                            variant="outline"
                            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 rounded-full px-6 gap-2 shadow-sm font-medium ml-auto">
                            Details
                            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </Button>
                    </CollapsibleTrigger>
                </div>
            </div>
        </Collapsible>
    );
};
