import { LayoutGrid, PlayCircle, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useComparisonStore } from '@/store/useStore.ts';
import { Button } from '@/components/ui/button';

export const Header = () => {
    const setDemoState = useComparisonStore((state) => state.setDemoState);
    const resetState = useComparisonStore((state) => state.resetState);

    return (
        <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition">
                <LayoutGrid className="w-6 h-6" />
                <span className="font-bold text-xl tracking-tight text-foreground">SwitchBoard</span>
            </Link>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetState}
                    className="gap-2 text-muted-foreground hover:text-destructive">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                </Button>
                <Button variant="outline" size="sm" onClick={setDemoState} className="gap-2">
                    <PlayCircle className="w-4 h-4" />
                    Demo
                </Button>
            </div>
        </header>
    );
};
