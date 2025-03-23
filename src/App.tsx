
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
import Announcement from "./components/Announcement";
import OnePieceBackground from "./components/OnePieceBackground";

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
          <OnePieceBackground>
            <Announcement />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/manga" element={<MangaNews />} />
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
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/create-room" element={<CreateRoomPage />} />
              <Route path="/room/:roomId" element={<RoomPage />} />
              <Route path="/share/:quizId" element={<PlayQuiz />} />
              <Route path="/admin/*" element={
                <AuthenticatedRoute requireAdmin={true}>
                  <AdminIndex />
                </AuthenticatedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </OnePieceBackground>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
