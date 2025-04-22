"use client";

import { createContext, useContext, useEffect, useState } from "react";

const DemoContext = createContext<{
  isDemo: boolean;
  enterDemo: () => void;
  exitDemo: () => void;
}>({
  isDemo: false,
  enterDemo: () => {},
  exitDemo: () => {},
});

export const DemoProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("demo_mode");
    if (stored === "true") {
      setIsDemo(true);
    }
  }, []);

  const enterDemo = () => {
    localStorage.setItem("demo_mode", "true");
    setIsDemo(true);
  };

  const exitDemo = () => {
    localStorage.removeItem("demo_mode");
    setIsDemo(false);
  };

  return (
    <DemoContext.Provider value={{ isDemo, enterDemo, exitDemo }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => useContext(DemoContext);
