function GlowWrapper({ children }) {

  return (

    <div className="relative flex justify-center items-center">

      {/* Glow Background */}

      <div className="absolute w-[120%] h-[120%] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-3xl animate-pulse rounded-full"></div>

      {/* Content */}

      <div className="relative">
        {children}
      </div>

    </div>

  );

}

export default GlowWrapper;