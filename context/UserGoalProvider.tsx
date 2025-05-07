"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type UserGoalContextType = {
  selectedGoal: string;
  setSelectedGoal: (goal: string) => void;
  isOwner: boolean;
};

const UserGoalContext = createContext<UserGoalContextType | undefined>(
  undefined
);

export const UserGoalProvider = ({ children }: { children: ReactNode }) => {
  const [selectedGoal, setSelectedGoal] = useState("");

  useEffect(() => {
    // Load the goal from localStorage on initial mount
    const savedGoal = localStorage.getItem("user_goal");
    if (savedGoal) {
      setSelectedGoal(savedGoal);
    }
  }, []);

  const handleSetSelectedGoal = (goal: string) => {
    setSelectedGoal(goal);
    localStorage.setItem("user_goal", goal);
  };

  const isOwner = [
    "I will live here full-time",
    "It will be my second home",
  ].includes(selectedGoal);

  return (
    <UserGoalContext.Provider
      value={{ selectedGoal, setSelectedGoal: handleSetSelectedGoal, isOwner }}
    >
      {children}
    </UserGoalContext.Provider>
  );
};

export const useUserGoal = (): UserGoalContextType => {
  const context = useContext(UserGoalContext);
  if (!context) {
    throw new Error("useUserGoal must be used within a UserGoalProvider");
  }
  return context;
};
