import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

import arrow from "../images/arrow.svg";
import SLIDERS_QUERY from "../apollo/queries/sliders_query";

import "./App.scss";

gsap.registerPlugin(Draggable);

interface imageDataInterface {
  url: string;
}

interface imagesInterface {
  image: imageDataInterface;
  caption: string;
  id: string;
}

function App() {
  const slidesRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const { loading, data } = useQuery(SLIDERS_QUERY);

  // holds the images for the slider
  const imageElements =
    !loading &&
    data.sliders.map((img: imagesInterface) => (
      <img
        key={img.id}
        src={img.image.url}
        alt={img.caption}
        className="slider__slides__image"
      />
    ));

  // holds the indicators
  const indicators =
    !loading &&
    data.sliders.map((img: imagesInterface, i: number) => (
      <span
        key={img.id}
        className={`slider__indicators__indicator ${i === index && "active"}`}
      />
    ));

    // goes to the next image
  const nextImage = useCallback(() => {
    const slidersLength = loading ? 0 : data.sliders.length;
    if (index < slidersLength - 1) {
      setIndex((i) => i + 1);
    }
  }, [data, index, loading]);

  // goes to the previous image
  const previousImage = useCallback(() => {
    if (index > 0) {
      setIndex((i) => i - 1);
    }
  }, [index]);

  // enables the slode show
  useEffect(() => {
    if (slidesRef.current) {
      const slideWidth: number = slidesRef.current.clientWidth;
      slidesRef.current.setAttribute(
        "style",
        `transform: translateX(-${slideWidth * index}px);`
      );
    }
  }, [index]);

  // enable the draggable 
  useEffect(() => {
    if (!loading && data) {
      new Draggable(".slider", {
        type: "x",
        lockAxis: true,
        onDrag: function () {
          if (this.getDirection() === "left" && index < data.sliders.length - 1)
            nextImage();
          else this.endDrag();

          if (this.getDirection() === "right" && index > 0) previousImage();
          else this.endDrag();

          // stop the slider from shifting
          const slider = document.getElementsByClassName("slider").item(0);
          slider?.setAttribute("style", ``);
        },
      });
    }
  }, [data, index, loading, nextImage, previousImage]);

  return (
    <div className="app">
      {!loading && data && (
        <section className="slider">
          <div className="slider__controls">
            <img
              src={arrow}
              className={`slider__controls__arrow previous ${
                index === 0 && "disabled"
              }`}
              role="button"
              aria-label="Previous Image"
              onClick={previousImage}
            />
            <span className="slider__controls__divider" />
            <img
              src={arrow}
              className={`slider__controls__arrow next ${
                index === data.sliders.length - 1 && "disabled"
              }`}
              role="button"
              aria-label="Next Image"
              onClick={nextImage}
            />
          </div>
          <div className="slider__indicators">{indicators}</div>
          <div id="slider__slides" ref={slidesRef} className="slider__slides">
            {imageElements}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
