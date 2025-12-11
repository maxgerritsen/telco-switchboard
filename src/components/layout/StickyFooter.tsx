import { useComparisonStore } from '@/store/useStore.ts';
import { useComparisonCalculations } from '@/hooks/useComparisonCalculations.ts';
import { ChevronDown, ChevronUp, Github } from 'lucide-react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';
import { calculatePlanCost } from '@/lib/plans.ts';

export const StickyFooter = () => {
    const [expanded, setExpanded] = useState(false);
    const { internet, mobilePeople } = useComparisonStore();

    const { maxDuration, hasData, metricsAtEnd, metricsAt1Year, metricsAt2Years } = useComparisonCalculations();

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

    return (
        <Collapsible
            open={expanded}
            onOpenChange={setExpanded}
            className="fixed bottom-0 inset-x-0 z-40 flex flex-col justify-end">
            <CollapsibleContent className="bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="max-w-7xl mx-auto px-6 py-6 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="rounded-lg border  overflow-hidden shadow-sm bg-white">
                        <table className="w-full text-sm">
                            <thead className="bg-muted border-b">
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
                                {internet && (
                                    <tr className="bg-gray-50 font-semibold">
                                        <td className="px-6 py-4 text-gray-800">Internet & TV</td>
                                        <td className="px-6 py-4 text-right">
                                            {renderPrice(metricsAtEnd.internet.current)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {renderPrice(metricsAtEnd.internet.new)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {renderDelta(metricsAtEnd.internet.delta)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {renderDelta(metricsAt1Year.internet.delta)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {renderDelta(metricsAt2Years.internet.delta)}
                                        </td>
                                    </tr>
                                )}

                                {mobilePeople.length > 0 && (
                                    <>
                                        <tr className="bg-gray-50 font-semibold">
                                            <td className="px-6 py-4 text-gray-800">Mobiel (Totaal)</td>
                                            <td className="px-6 py-4 text-right">
                                                {renderPrice(metricsAtEnd.mobile.current)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {renderPrice(metricsAtEnd.mobile.new)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {renderDelta(metricsAtEnd.mobile.delta)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-normal">
                                                {renderDelta(metricsAt1Year.mobile.delta)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-normal">
                                                {renderDelta(metricsAt2Years.mobile.delta)}
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
                                                    <td className="px-6 py-3 text-right">{renderPrice(currentCost)}</td>
                                                    <td className="px-6 py-3 text-right">{renderPrice(newCost)}</td>
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
                            <tfoot className="bg-muted border-t font-bold">
                                <tr>
                                    <td className="px-6 py-4 text-gray-900">Totaal</td>
                                    <td className="px-6 py-4 text-right">{renderPrice(metricsAtEnd.total.new)}</td>
                                    <td className="px-6 py-4 text-right">{renderPrice(metricsAtEnd.total.current)}</td>
                                    <td className="px-6 py-4 text-right text-lg">
                                        {renderDelta(metricsAtEnd.total.delta)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-lg">
                                        {renderDelta(metricsAt1Year.total.delta)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-lg">
                                        {renderDelta(metricsAt2Years.total.delta)}
                                    </td>
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
                                {hasData ? (
                                    renderDelta(metricsAtEnd.total.delta, false)
                                ) : (
                                    <span className="text-gray-300">--</span>
                                )}
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                1 jaar later
                            </p>
                            <div className="text-2xl font-bold tracking-tight">
                                {hasData ? (
                                    renderDelta(metricsAt1Year.total.delta, false)
                                ) : (
                                    <span className="text-gray-300">--</span>
                                )}
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                2 jaar later
                            </p>
                            <div className="text-2xl font-bold tracking-tight">
                                {hasData ? (
                                    renderDelta(metricsAt2Years.total.delta, false)
                                ) : (
                                    <span className="text-gray-300">--</span>
                                )}
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
            <div className="bg-zinc-900 text-white text-sm py-2 text-center font-medium flex items-center justify-center gap-2">
                <span>SwitchBoard v{import.meta.env.PACKAGE_VERSION}</span>
                <a
                    href="https://github.com/maxgerritsen/telco-switchboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors">
                    <Github className="w-4 h-4" />
                </a>
                <span>
                    Made by{' '}
                    <a
                        href="https://www.linkedin.com/in/maxgerritsen/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-400 transition-colors underline">
                        Max Gerritsen
                    </a>
                </span>
            </div>
        </Collapsible>
    );
};
