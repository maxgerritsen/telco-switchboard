import { LayoutGrid, PlayCircle, RotateCcw, Link2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useComparisonStore } from '@/store/useStore.ts';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator.tsx';

export const Header = () => {
    const setDemoState = useComparisonStore((state) => state.setDemoState);
    const resetState = useComparisonStore((state) => state.resetState);
    const [copied, setCopied] = useState(false);

    const handleCopyUrl = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-4 text-primary">
                <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition">
                    <LayoutGrid className="w-6 h-6" />
                    <span className="font-bold text-xl tracking-tight text-foreground">SwitchBoard</span>
                </Link>
                <Separator orientation="vertical" className="bg-primary" />
                <Button variant="outline" size="sm" onClick={setDemoState} className="gap-2">
                    <PlayCircle className="w-4 h-4" />
                    Demo
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetState}
                    className="gap-2 text-muted-foreground hover:text-destructive">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopyUrl} className="gap-2 min-w-[100px]">
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            Gekopieerd
                        </>
                    ) : (
                        <>
                            <Link2 className="w-4 h-4" />
                            Link naar deze vergelijking kopiëren
                        </>
                    )}
                </Button>
            </div>
        </header>
    );
};
