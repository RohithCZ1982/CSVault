import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import LawExplorer from './pages/LawExplorer';
import TopicDetail from './pages/TopicDetail';
import PracticeHub from './pages/PracticeHub';
import MockTest from './pages/MockTest';
import AIAssistant from './pages/AIAssistant';
import Documents from './pages/Documents';
import StudyPlanner from './pages/StudyPlanner';
import ComplianceSimulator from './pages/ComplianceSimulator';
import Profile from './pages/Profile';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(s => s.token);
  return token ? <>{children}</> : <Navigate to="/auth" replace />;
}

export default function App() {
  const token = useAuthStore(s => s.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/auth" element={token ? <Navigate to="/dashboard" replace /> : <Auth />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/law-explorer" element={<LawExplorer />} />
                  <Route path="/law-explorer/:id" element={<TopicDetail />} />
                  <Route path="/practice" element={<PracticeHub />} />
                  <Route path="/practice/test" element={<MockTest />} />
                  <Route path="/ai-assistant" element={<AIAssistant />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/study-planner" element={<StudyPlanner />} />
                  <Route path="/compliance-simulator" element={<ComplianceSimulator />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
