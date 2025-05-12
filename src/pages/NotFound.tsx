
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import StarBackground from "@/components/StarBackground";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <StarBackground starCount={100} />
      
      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-bold mb-4 text-white">404</h1>
        <p className="text-xl text-white/70 mb-8">Oops! Página não encontrada</p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-nebula-purple to-nebula-blue text-white hover:from-nebula-purple/90 hover:to-nebula-blue/90"
        >
          Voltar para o Início
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
