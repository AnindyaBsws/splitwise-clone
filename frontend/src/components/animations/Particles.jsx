import { useEffect, useState } from "react";

function Particles() {

  const [particles, setParticles] = useState([]);

  useEffect(() => {

    const generated = Array.from({ length: 35 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 4,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * 10
    }));

    setParticles(generated);

  }, []);

  return (

    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">

      {particles.map((p, i) => (

        <div
          key={i}
          className="absolute rounded-full bg-white opacity-30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`
          }}
        />

      ))}

    </div>

  );

}

export default Particles;