import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

function AnimatedSection({ children }) {

  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0.85 1", "0.15 0"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 0]);

  const smoothOpacity = useSpring(opacity, { stiffness: 180, damping: 18 });
  const smoothY = useSpring(y, { stiffness: 180, damping: 18 });
  const smoothScale = useSpring(scale, { stiffness: 180, damping: 18 });
  const smoothRotate = useSpring(rotate, { stiffness: 180, damping: 18 });

  return (
    <motion.div
      ref={ref}
      style={{
        opacity: smoothOpacity,
        y: smoothY,
        scale: smoothScale,
        rotate: smoothRotate
      }}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedSection;