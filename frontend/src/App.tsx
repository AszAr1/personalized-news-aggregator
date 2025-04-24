import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage.tsx';
import CategoryPage from './pages/CategoryPage.tsx'
import SearchPage from "./pages/SearchPage.tsx"
import { Header } from "./components/Header";
import LogInPage from "./pages/LogInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx"
import usePageNumber from './state/usePageNumberStore.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './contexts/ToastContext.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';

export const queryClient = new QueryClient();

function App() {
    const { pageNumber, setPageNumber } = usePageNumber()

    return <div className="font-mono">
        <ToastProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <Router>
                        <Header setPageNumber={setPageNumber} />
                        <Routes>
                            <Route path="/" element={
                                <HomePage pageNumber={pageNumber} setPageNumber={setPageNumber} />
                            } />
                            <Route path="/:category" element={
                                <CategoryPage pageNumber={pageNumber} setPageNumber={setPageNumber} />
                            } />
                            <Route path="/search" element={<SearchPage />}></Route>
                            <Route path="/login" element={<LogInPage />}></Route>
                            <Route path="/signup" element={<SignUpPage />}></Route>
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </Router>
                </AuthProvider>
            </QueryClientProvider>
        </ToastProvider>
    </div >
}


export default App;
