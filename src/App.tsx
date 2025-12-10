import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from '@/components/layout/Header.tsx';
import { Dashboard } from '@/components/layout/Dashboard.tsx';

function App() {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <div className="min-h-screen bg-background flex flex-col font-sans">
                <Header />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
