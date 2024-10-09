import { useState } from "react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { X, Menu, Sparkles } from "lucide-react";

interface UserProfile {
  user_id: string;
  credits: number;
  tier: string;
}

interface HeaderProps {
  userProfile: UserProfile | null;
}

export default function Header({ userProfile }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center">
            <Sparkles className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> AI Emoji maker
          </h2>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-purple-100"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              {userProfile && (
                <span className="bg-white text-purple-600 px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                  Credits: {userProfile.credits}
                </span>
              )}
              <UserButton afterSignOutUrl="/" />
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
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md rounded-md p-4 absolute right-4 mt-2">
          {/* Add your menu items here */}
        </div>
      )}
    </div>
  );
}
