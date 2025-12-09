import { useComparisonStore } from '@/store/useStore.ts';
import { Trash2, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { PlanForm } from '@/components/PlanForm.tsx';

export const InternetSection = () => {
    const { internet, updateInternetPlan, addInternetPlan, removeInternetPlan } = useComparisonStore();

    if (!internet) {
        return (
            <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
                <p className="text-muted-foreground mb-4">Nog geen Internet & TV abonnement toegevoegd.</p>
                <Button onClick={addInternetPlan} className="gap-2">
                    <Wifi className="w-4 h-4" />
                    Internet & TV toevoegen
                </Button>
            </div>
        );
    }

    return (
        <Card className="p-0 gap-0 overflow-hidden">
            <CardHeader className="border-b bg-muted py-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-muted-foreground" />
                    <CardTitle className="text-lg">Internet & TV</CardTitle>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeInternetPlan}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                    <div className="p-6">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                            Huidige situatie
                        </h3>
                        <PlanForm
                            plan={internet.current}
                            onUpdate={(updates) => updateInternetPlan('current', updates)}
                        />
                    </div>
                    <div className="p-6 bg-green-600/10">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">
                            Nieuw aanbod
                        </h3>
                        <PlanForm plan={internet.new} onUpdate={(updates) => updateInternetPlan('new', updates)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
