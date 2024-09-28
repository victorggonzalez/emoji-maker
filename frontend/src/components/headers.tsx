import { useState } from 'react';
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";
import { Button } from './ui/button';
import { X, Menu } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex items-center space-x-4 justify-between mt-4 mx-4">
      <h2 className="text-2xl font-bold">Emoj maker</h2>
      <div className="flex items-center space-x-4">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="default">Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
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
