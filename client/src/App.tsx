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
import AdminDashboard from './pages/AdminDashboard';
import { hasFeature, Feature } from './utils/plans';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(s => s.token);
  return token ? <>{children}</> : <Navigate to="/auth" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(s => s.user);
  return user?.role === 'ADMIN' ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

function FeatureRoute({ feature, children }: { feature: Feature; children: React.ReactNode }) {
  const user = useAuthStore(s => s.user);
  return hasFeature(user, feature) ? <>{children}</> : <Navigate to="/dashboard" replace />;
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
                  <Route path="/law-explorer" element={<FeatureRoute feature="lawExplorer"><LawExplorer /></FeatureRoute>} />
                  <Route path="/law-explorer/:id" element={<FeatureRoute feature="lawExplorer"><TopicDetail /></FeatureRoute>} />
                  <Route path="/practice" element={<FeatureRoute feature="practice"><PracticeHub /></FeatureRoute>} />
                  <Route path="/practice/test" element={<FeatureRoute feature="practice"><MockTest /></FeatureRoute>} />
                  <Route path="/ai-assistant" element={<FeatureRoute feature="ai"><AIAssistant /></FeatureRoute>} />
                  <Route path="/documents" element={<FeatureRoute feature="documents"><Documents /></FeatureRoute>} />
                  <Route path="/study-planner" element={<FeatureRoute feature="studyPlanner"><StudyPlanner /></FeatureRoute>} />
                  <Route path="/compliance-simulator" element={<FeatureRoute feature="compliance"><ComplianceSimulator /></FeatureRoute>} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
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
