import type { SubscriptionPlan } from '@/types.ts';
import { NumberInput } from '@/components/ui/NumberInput.tsx';
import { Label } from '@/components/ui/label.tsx';
import { TimelineSummary } from '@/components/TimelineSummary.tsx';
import { DeviceFields } from '@/components/plans/DeviceFields.tsx';
import { PromotionsList } from '@/components/plans/PromotionsList.tsx';

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

            {showDeviceFields && <DeviceFields plan={plan} onUpdate={onUpdate} />}

            <PromotionsList plan={plan} onUpdate={onUpdate} />

            <div className="pt-2 border-t border-border">
                <TimelineSummary plan={plan} />
            </div>
        </div>
    );
};
