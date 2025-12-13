import type { SubscriptionPlan } from '@/types.ts';
import { createEmptyDeviceDetails } from '@/lib/plans.ts';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Label } from '@/components/ui/label.tsx';
import { NumberInput } from '@/components/ui/NumberInput.tsx';

interface Props {
    plan: SubscriptionPlan;
    onUpdate: (updates: Partial<SubscriptionPlan>) => void;
}

export const DeviceFields = ({ plan, onUpdate }: Props) => {
    return (
        <div className="bg-white p-4 rounded-md border border-border">
            <div className="flex items-center gap-2 mb-4">
                <Checkbox
                    id={`device-${plan.id}`}
                    checked={!!plan.deviceDetails}
                    onCheckedChange={(checked) =>
                        onUpdate({
                            deviceDetails: checked ? createEmptyDeviceDetails() : undefined,
                        })
                    }
                />
                <Label htmlFor={`device-${plan.id}`}>Inclusief toestel</Label>
            </div>

            {plan.deviceDetails && (
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
    );
};
