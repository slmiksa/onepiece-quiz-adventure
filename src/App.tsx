
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import MangaNews from "./pages/MangaNews";
import QuizGame from "./pages/QuizGame";
import PlayQuiz from "./pages/PlayQuiz";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Rooms from "./pages/Rooms";
import CreateRoomPage from "./pages/CreateRoomPage";
import RoomPage from "./pages/RoomPage";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import AdminIndex from "./pages/admin/AdminIndex";
import AdminLogin from "./pages/admin/AdminLogin";
import Announcement from "./components/Announcement";
import OnePieceBackground from "./components/OnePieceBackground";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="bg-white min-h-screen">
            <Announcement />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/manga" element={
                <AuthenticatedRoute>
                  <MangaNews />
                </AuthenticatedRoute>
              } />
              <Route path="/profile" element={
                <AuthenticatedRoute>
                  <ProfilePage />
                </AuthenticatedRoute>
              } />
              <Route path="/quiz" element={
                <AuthenticatedRoute>
                  <QuizGame />
                </AuthenticatedRoute>
              } />
              <Route path="/play" element={
                <AuthenticatedRoute>
                  <PlayQuiz />
                </AuthenticatedRoute>
              } />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/rooms" element={
                <AuthenticatedRoute>
                  <Rooms />
                </AuthenticatedRoute>
              } />
              <Route path="/create-room" element={
                <AuthenticatedRoute>
                  <CreateRoomPage />
                </AuthenticatedRoute>
              } />
              <Route path="/room/:roomId" element={
                <AuthenticatedRoute>
                  <RoomPage />
                </AuthenticatedRoute>
              } />
              <Route path="/share/:quizId" element={
                <AuthenticatedRoute>
                  <PlayQuiz />
                </AuthenticatedRoute>
              } />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={
                <AuthenticatedRoute requireAdmin={true}>
                  <AdminIndex />
                </AuthenticatedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
