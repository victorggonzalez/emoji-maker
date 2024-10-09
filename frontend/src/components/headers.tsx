import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, UserButton, SignInButton, useAuth } from "@clerk/clerk-react";
import { Button } from './ui/button';
import { X, Menu } from 'lucide-react';
import { API_URL } from "../config";

interface UserProfile {
  user_id: string;
  credits: number;
  tier: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, getToken } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const initializeUser = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          const response = await fetch(`${API_URL}/api/initialize-user`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) {
            throw new Error('Failed to initialize user');
          }
          const data = await response.json();
          setUserProfile(data.profile);
          console.log('User initialized successfully');
        } catch (error) {
          console.error('Error initializing user:', error);
        }
      }
    };

    initializeUser();
  }, [isSignedIn, getToken]);

  return (
    <div className="flex items-center space-x-4 justify-between mt-4 mx-4">
      <h2 className="text-2xl font-bold">AI Emoj maker</h2>
      <div className="flex items-center space-x-4">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="default">Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          {userProfile && (
            <span className="mr-4">Credits: {userProfile.credits}</span>
          )}
          <UserButton />
        </SignedIn>
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="absolute top-16 right-4 bg-white shadow-md rounded-md p-4">
          {/* Add your menu items here */}
        </div>
      )}
    </div>
  );
}
