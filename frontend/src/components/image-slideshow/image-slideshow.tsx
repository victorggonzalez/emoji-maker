import { useEffect, useState } from "react";
import berneseDog from "@/assets/emoji_1744051213685.png";
import rooster from "@/assets/emoji_1744052206911.png";
import guy from "@/assets/emoji_1744053618300.png";

const images = [
  { image: berneseDog, alt: "A Bernese dog with a magician hat" },
  { image: rooster, alt: "A rooster" },
  { image: guy, alt: "A young guy with blond curly hair" },
];

const ImageSlideshow = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
      
      {images.map((imageData, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={imageData.image}
            alt={imageData.alt}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      ))}
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-white shadow-lg' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlideshow;
