import { SignInButton } from "@clerk/clerk-react";
import ImageSlideshow from "../../components/image-slideshow/image-slideshow";
import { Button } from "../../components/ui/button";

const SignedOutContent = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center bg-white bg-opacity-80 p-4 sm:p-8 rounded-lg shadow-md mt-4 gap-6">
      <div className="w-full sm:w-1/2">
        <ImageSlideshow />
      </div>
      <div className="w-full sm:w-1/2 flex flex-col justify-center text-center sm:text-left gap-4">
        <p className="text-lg sm:text-xl font-semibold text-purple-600">
          Welcome to Emoj maker!
        </p>
        <p className="text-sm sm:text-base text-gray-600">
          Sign in to start creating and interacting with emojis.
        </p>
        <SignInButton mode="modal">
          <Button
            variant="secondary"
            className="bg-purple-600 text-white hover:bg-blue-500"
          >
            Sign In
          </Button>
        </SignInButton>
      </div>
    </div>
  );
};

export default SignedOutContent;
