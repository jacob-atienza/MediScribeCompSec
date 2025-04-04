
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from 'react-router-dom';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="bg-medical-primary rounded-md h-8 w-8 flex items-center justify-center text-white font-bold">MR</span>
          <span className="text-xl font-semibold">Medical Records Assistant</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button onClick={signOut} variant="outline">
                Sign Out
              </Button>
              <div className="flex items-center space-x-2 border-l pl-4 ml-4">
                <div className="h-8 w-8 rounded-full bg-medical-primary text-white flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{user.name}</span>
              </div>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('/login')}>
                Log In
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
