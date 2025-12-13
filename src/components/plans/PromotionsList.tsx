import type { SubscriptionPlan } from '@/types.ts';
import { Label } from '@/components/ui/label.tsx';
import { NumberInput } from '@/components/ui/NumberInput.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Plus, X } from 'lucide-react';
import { createId } from '@/lib/utils.ts';

interface Props {
    plan: SubscriptionPlan;
    onUpdate: (updates: Partial<SubscriptionPlan>) => void;
}

export const PromotionsList = ({ plan, onUpdate }: Props) => {
    return (
        <div className="space-y-4">
            <Label>Kortingsacties</Label>
            {plan.promotions.map((promo, idx) => {
                const previousPromos = plan.promotions.slice(0, idx);
                const startMonth = previousPromos.reduce((total, p) => total + (p.durationMonths || 0), 0) + 1;
                const endMonth = promo.durationMonths ? startMonth + promo.durationMonths - 1 : undefined;

                return (
                    <div key={promo.id} className="flex gap-2 items-center">
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap w-24">
                                Maand {startMonth} tot
                            </span>
                            <NumberInput
                                value={endMonth}
                                onValueChange={(val) => {
                                    if (val === undefined) {
                                        const newPromos = [...plan.promotions];
                                        newPromos[idx] = { ...promo, durationMonths: undefined };
                                        onUpdate({ promotions: newPromos });
                                        return;
                                    }
                                    const newEndMonth = val;
                                    const newDuration = newEndMonth - startMonth + 1;
                                    const newPromos = [...plan.promotions];
                                    newPromos[idx] = { ...promo, durationMonths: newDuration };
                                    onUpdate({ promotions: newPromos });
                                }}
                                className={`w-14 ${endMonth === undefined ? 'border-destructive' : ''}`}
                            />
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-sm text-muted-foreground">:</span>
                            <NumberInput
                                value={promo.discountedPrice}
                                onValueChange={(val) => {
                                    const newPromos = [...plan.promotions];
                                    newPromos[idx] = {
                                        ...promo,
                                        discountedPrice: val,
                                    };
                                    onUpdate({ promotions: newPromos });
                                }}
                                className={`w-20 ${promo.discountedPrice === undefined ? 'border-destructive' : ''}`}
                            />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">per maand</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                const newPromos = plan.promotions.filter((p) => p.id !== promo.id);
                                onUpdate({ promotions: newPromos });
                            }}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                );
            })}
            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    onUpdate({
                        promotions: [
                            ...plan.promotions,
                            {
                                id: createId(),
                                durationMonths: undefined,
                                discountedPrice: undefined,
                            },
                        ],
                    });
                }}
                className="w-full border-dashed text-muted-foreground hover:text-primary">
                <Plus className="h-4 w-4 mr-2" />
                Kortingsactie toevoegen
            </Button>
        </div>
    );
};
