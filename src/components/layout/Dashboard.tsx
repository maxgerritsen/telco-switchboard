import { StickyFooter } from '@/components/layout/StickyFooter.tsx';
import { InternetSection } from '@/components/InternetSection.tsx';
import { MobileSection } from '@/components/MobileSection.tsx';

export const Dashboard = () => {
    return (
        <div className="pb-32 animate-in slide-in-from-bottom-4 duration-500">
            <main className="max-w-7xl mx-auto p-6 space-y-12">
                <InternetSection />
                <MobileSection />
            </main>
            <StickyFooter />
        </div>
    );
};
