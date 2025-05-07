
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { auth } from "@/config/firebase";
import { logoutUser } from "@/services/authService";

const Header = () => {
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUsername(user.email || "User");
      } else {
        setUsername(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("selectedCourse");
      localStorage.removeItem("enrolledUser");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Logout failed");
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/courses" className="flex items-center">
          <span className="text-xl font-bold text-blue-600">LearnHub</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {username ? (
            <>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                Welcome, {username}
              </span>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="text-sm"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="text-sm"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
