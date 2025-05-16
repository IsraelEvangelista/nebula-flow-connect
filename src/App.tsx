
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { BackgroundProvider } from "./context/BackgroundContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";

import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Calendar from "./pages/Calendar";
import Youtube from "./pages/Youtube";
import Music from "./pages/Music";

const queryClient = new QueryClient();

const App = () => {
  // Ensure proper styling for the root and body elements
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.body.style.width = "100vw";
    document.body.style.backgroundColor = "#121212"; // Set a dark background color as fallback
    
    const rootEl = document.getElementById("root");
    if (rootEl) {
      rootEl.style.height = "100vh";
      rootEl.style.width = "100vw";
      rootEl.style.margin = "0";
      rootEl.style.padding = "0";
      rootEl.style.overflow = "hidden";
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider>
              <BackgroundProvider>
                <ChatProvider>
                  <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route 
                      path="/chat" 
                      element={
                        <ProtectedRoute>
                          <Chat />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/calendar" 
                      element={
                        <ProtectedRoute>
                          <Calendar />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/youtube" 
                      element={
                        <ProtectedRoute>
                          <Youtube />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/music" 
                      element={
                        <ProtectedRoute>
                          <Music />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ChatProvider>
              </BackgroundProvider>
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
