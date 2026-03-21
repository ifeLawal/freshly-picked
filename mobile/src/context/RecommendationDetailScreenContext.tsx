import React, { createContext, useContext, useState, useCallback } from 'react';

type RecommendationDetailScreenContextValue = {
  isOnRecommendationDetailScreen: boolean;
  setOnRecommendationDetailScreen: (value: boolean) => void;
};

const RecommendationDetailScreenContext = createContext<RecommendationDetailScreenContextValue | null>(null);

export function RecommendationDetailScreenProvider({ children }: { children: React.ReactNode }) {
  const [isOnRecommendationDetailScreen, setOnRecommendationDetailScreen] = useState(false);
  const setter = useCallback((value: boolean) => setOnRecommendationDetailScreen(value), []);
  return (
    <RecommendationDetailScreenContext.Provider
      value={{ isOnRecommendationDetailScreen, setOnRecommendationDetailScreen: setter }}
    >
      {children}
    </RecommendationDetailScreenContext.Provider>
  );
}

export function useRecommendationDetailScreen() {
  const ctx = useContext(RecommendationDetailScreenContext);
  if (!ctx) {
    return { isOnRecommendationDetailScreen: false, setOnRecommendationDetailScreen: () => {} };
  }
  return ctx;
}
