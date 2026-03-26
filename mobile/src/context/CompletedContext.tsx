import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../utils/storage';

interface CompletedContextType {
  completed: Set<string>;
  toggleCompleted: (id: string) => void;
  isCompleted: (id: string) => boolean;
}

const CompletedContext = createContext<CompletedContextType | undefined>(undefined);

export function CompletedProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const loaded = await storage.getCompleted();
      setCompleted(loaded);
      setIsLoaded(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      storage.saveCompleted(completed);
    }
  }, [completed, isLoaded]);

  const toggleCompleted = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isCompleted = (id: string) => completed.has(id);

  return (
    <CompletedContext.Provider value={{ completed, toggleCompleted, isCompleted }}>
      {children}
    </CompletedContext.Provider>
  );
}

export function useCompleted() {
  const context = useContext(CompletedContext);
  if (context === undefined) {
    throw new Error('useCompleted must be used within a CompletedProvider');
  }
  return context;
}
