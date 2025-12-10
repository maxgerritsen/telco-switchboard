import type { SubscriptionPlan } from '@/types.ts';
import { Badge } from '@/components/ui/badge.tsx';
import { ArrowRight } from 'lucide-react';

interface Props {
    plan: SubscriptionPlan;
}

export const TimelineSummary = ({ plan }: Props) => {
    const { promotions, basePrice } = plan;

    if (promotions.length === 0) {
        return (
            <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                <span>
                    Normale prijs na einde contract (excl. eventueel toestelkrediet): €{basePrice ?? 0} per maand
                </span>
            </div>
        );
    }

    return (
        <div className="text-sm text-muted-foreground mt-2 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
                {promotions.map((promo, idx) => {
                    const previousPromos = promotions.slice(0, idx);
                    const startMonth = previousPromos.reduce((total, p) => total + (p.durationMonths || 0), 0) + 1;
                    const endMonth = startMonth + (promo.durationMonths || 0) - 1;

                    return (
                        <div key={promo.id} className="flex items-center gap-2">
                            <Badge variant="secondary" className="font-medium">
                                Maand {startMonth} - {endMonth}: €{promo.discountedPrice ?? 0}
                            </Badge>
                            <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
                        </div>
                    );
                })}
                <span className="font-medium text-foreground">Daarna: €{basePrice ?? 0}</span>
            </div>
        </div>
    );
};
