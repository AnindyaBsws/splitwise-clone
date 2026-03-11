import { useRef } from "react";

function TiltImage({ src, alt }) {

  const ref = useRef();

  const handleMouseMove = (e) => {

    const el = ref.current;
    const rect = el.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 20;
    const rotateY = (x - centerX) / 20;

    el.style.transform =
      `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;

  };

  const handleMouseLeave = () => {

    const el = ref.current;

    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";

  };

  return (

    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="transition-transform duration-300 ease-out"
    >

      <img
        src={src}
        alt={alt}
        className="rounded-xl shadow-2xl"
      />

    </div>

  );

}

export default TiltImage;