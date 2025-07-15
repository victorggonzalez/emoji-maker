import { useEffect, useState } from "react";
import berneseDog from "@/assets/emoji_1744051213685.png";
import rooster from "@/assets/emoji_1744052206911.png";
import guy from "@/assets/emoji_1744053618300.png";
import classes from "./image-slideshow.module.css";

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
    <div className={classes.slideshow}>
      {images.map((image, index) => (
          <img
            key={index}
            src={image.image}
            className={index === currentImageIndex ? classes.active : ""}
            alt={image.alt}
          />
      ))}
    </div>
  );
};

export default ImageSlideshow;
