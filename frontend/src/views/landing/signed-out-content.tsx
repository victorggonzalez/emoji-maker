import { SignInButton } from "@clerk/clerk-react";
import ImageSlideshow from "../../components/image-slideshow/image-slideshow";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

const SignedOutContent = () => {
  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative rounded-xl overflow-hidden">
      {/* Main content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column - Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Hero heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Emoji Maker
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Create personalized emojis that express your unique personality.
                Ideate, create, and share your digital emojis with the world.
              </p>
            </div>

            {/* Features list */}
            <div className="grid sm:grid-cols-2 gap-4 text-left max-w-md mx-auto lg:mx-0">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">Unlimited creativity</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">Free to start</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <SignInButton mode="modal">
                <Button
                  variant="secondary"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <span className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative">Sign In To Start Creating</span>
                </Button>
              </SignInButton>

              <a href="https://github.com/victorggonzalez/emoji-maker">
                <Button className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:text-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <GitHubLogoIcon />
                  <p className="pl-2">Learn More</p>
                </Button>
              </a>
            </div>
          </div>

          {/* Right column - Image slideshow */}
          <div className="order-first lg:order-last">
            <ImageSlideshow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignedOutContent;
