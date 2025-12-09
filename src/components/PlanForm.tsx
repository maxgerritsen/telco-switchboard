import type { SubscriptionPlan } from '@/types.ts';
import { v4 as uuidv4 } from 'uuid';
import { NumberInput } from '@/components/ui/NumberInput.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { TimelineSummary } from '@/components/TimelineSummary.tsx';
import { Plus, X } from 'lucide-react';

interface Props {
    plan: SubscriptionPlan;
    onUpdate: (updates: Partial<SubscriptionPlan>) => void;
    showDeviceFields?: boolean;
}

export const PlanForm = ({ plan, onUpdate, showDeviceFields = false }: Props) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Normale prijs per maand (€)</Label>
                <NumberInput
                    value={plan.basePrice}
                    onValueChange={(val) => onUpdate({ basePrice: val })}
                    className={plan.basePrice === undefined ? 'border-destructive' : ''}
                />
            </div>

            <div className="space-y-2">
                <Label>Looptijd (maanden)</Label>
                <NumberInput
                    value={plan.contractDuration}
                    onValueChange={(val) => onUpdate({ contractDuration: val })}
                    className={plan.contractDuration === undefined ? 'border-destructive' : ''}
                />
            </div>

            {showDeviceFields && (
                <div className="bg-white p-4 rounded-md border border-border">
                    <div className="flex items-center gap-2 mb-4">
                        <Checkbox
                            id={`device-${plan.id}`}
                            checked={plan.deviceDetails?.hasDevice || false}
                            onCheckedChange={(checked) =>
                                onUpdate({
                                    deviceDetails: plan.deviceDetails
                                        ? {
                                              ...plan.deviceDetails,
                                              hasDevice: !!checked,
                                          }
                                        : undefined,
                                })
                            }
                        />
                        <Label htmlFor={`device-${plan.id}`}>Inclusief toestel</Label>
                    </div>

                    {plan.deviceDetails?.hasDevice && (
                        <div className="grid grid-cols-2 gap-4 pl-6">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Eenmalig (€)</Label>
                                <NumberInput
                                    value={plan.deviceDetails.upfrontCost}
                                    onValueChange={(val) =>
                                        onUpdate({
                                            deviceDetails: {
                                                ...plan.deviceDetails!,
                                                upfrontCost: val,
                                            },
                                        })
                                    }
                                    className={`h-8 text-sm ${
                                        plan.deviceDetails.upfrontCost === undefined ? 'border-destructive' : ''
                                    }`}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Toestelkrediet per maand (€)</Label>
                                <NumberInput
                                    value={plan.deviceDetails.monthlyCredit}
                                    onValueChange={(val) =>
                                        onUpdate({
                                            deviceDetails: {
                                                ...plan.deviceDetails!,
                                                monthlyCredit: val,
                                            },
                                        })
                                    }
                                    className={`h-8 text-sm ${
                                        plan.deviceDetails.monthlyCredit === undefined ? 'border-destructive' : ''
                                    }`}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

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
                                        // Allow any duration while typing to prevent input jumping validation.
                                        // isPlanComplete will ensure we don't calculate with invalid data.
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
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                                per maand
                            </span>
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
                                    id: uuidv4(),
                                    durationMonths: undefined,
                                    discountedPrice: undefined,
                                    label: '',
                                },
                            ],
                        });
                    }}
                    className="w-full border-dashed text-muted-foreground hover:text-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Kortingsactie toevoegen
                </Button>
            </div>

            <div className="pt-2 border-t border-border">
                <TimelineSummary plan={plan} />
            </div>
        </div>
    );
};
