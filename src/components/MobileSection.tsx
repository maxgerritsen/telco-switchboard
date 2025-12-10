import { useComparisonStore } from '@/store/useStore.ts';
import { PersonRow } from '@/components/PersonRow.tsx';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';

export const MobileSection = () => {
    const { mobilePeople, addMobilePerson } = useComparisonStore();

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Mobiele abonnementen</h2>
                <Button onClick={addMobilePerson} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Persoon toevoegen
                </Button>
            </div>

            <div className="space-y-6">
                {mobilePeople.map((person) => (
                    <PersonRow key={person.id} person={person} />
                ))}
            </div>

            {mobilePeople.length === 0 && (
                <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
                    <p className="text-muted-foreground mb-4">Nog geen mobiele abonnementen toegevoegd.</p>
                    <Button
                        variant="link"
                        onClick={addMobilePerson}
                        className="text-primary font-medium hover:underline">
                        Voeg de eerste persoon toe
                    </Button>
                </div>
            )}
        </section>
    );
};
