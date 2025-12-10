import { useComparisonStore } from '@/store/useStore.ts';
import { Smartphone, Trash2 } from 'lucide-react';
import type { MobilePerson } from '@/types.ts';
import { Card, CardContent, CardHeader } from './ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { PlanForm } from '@/components/PlanForm.tsx';

interface Props {
    person: MobilePerson;
}

export const PersonRow = ({ person }: Props) => {
    const { updateMobilePlan, removeMobilePerson, updateMobilePersonName } = useComparisonStore();

    return (
        <Card className="mb-6 p-0 gap-0 overflow-hidden">
            <CardHeader className="border-b bg-muted/40 py-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                    <Input
                        type="text"
                        value={person.name}
                        onChange={(e) => updateMobilePersonName(person.id, e.target.value)}
                        className="font-bold text-foreground bg-transparent border-none focus-visible:ring-0 p-0 h-auto w-48"
                    />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMobilePerson(person.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    title="Persoon verwijderen">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </CardHeader>

            <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                    <div className="p-6">
                        <PlanForm
                            plan={person.currentPlan}
                            onUpdate={(updates) => updateMobilePlan(person.id, 'current', updates)}
                            showDeviceFields={true}
                        />
                    </div>
                    <div className="p-6 bg-green-600/10">
                        <PlanForm
                            plan={person.newPlan}
                            onUpdate={(updates) => updateMobilePlan(person.id, 'new', updates)}
                            showDeviceFields={true}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
