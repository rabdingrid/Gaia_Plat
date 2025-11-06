import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { fetchSystemDesignProblem, askClarifyingQuestion } from '../api/systemDesign.api';
import type { SystemDesignContextType, SystemDesignProblem, ChatMessage } from '../types';

const TIMER_DURATION = 60 * 60; // 60 minutes

const SystemDesignContext = createContext<SystemDesignContextType | undefined>(undefined);

interface SystemDesignProviderProps {
  children: ReactNode;
}

export const SystemDesignProvider = ({ children }: SystemDesignProviderProps) => {
  const [problem, setProblem] = useState<SystemDesignProblem | null>(null);
  const [excalidrawData, setExcalidrawData] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [isLoading, setIsLoading] = useState(true);

  // Load problem on mount
  useEffect(() => {
    const loadProblem = async () => {
      try {
        const data = await fetchSystemDesignProblem();
        setProblem(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading problem:', error);
        setIsLoading(false);
      }
    };
    loadProblem();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleUpdateExcalidrawData = useCallback((data: any) => {
    setExcalidrawData(data);
  }, []);

  const handleUpdateNotes = useCallback((newNotes: string) => {
    setNotes(newNotes);
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim() || !problem) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setChatMessages((prev) => [...prev, userMessage]);

    try {
      const response = await askClarifyingQuestion(message, problem.id);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    }
  }, [problem]);

  const handleClearCanvas = useCallback((excalidrawAPI: any) => {
    if (excalidrawAPI) {
      try {
        const appState = excalidrawAPI.getAppState();
        excalidrawAPI.updateScene({
          elements: [],
          appState: appState ? {
            ...appState,
            scrollX: 0,
            scrollY: 0,
            zoom: { value: 1 }
          } : undefined
        });
      } catch (error) {
        console.error('Error clearing diagram:', error);
      }
    }
    setExcalidrawData(null);
  }, []);

  const value: SystemDesignContextType = {
    problem,
    excalidrawData,
    notes,
    chatMessages,
    timeRemaining,
    isLoading,
    updateExcalidrawData: handleUpdateExcalidrawData,
    updateNotes: handleUpdateNotes,
    sendMessage: handleSendMessage,
    clearCanvas: handleClearCanvas,
    formatTime
  };

  return <SystemDesignContext.Provider value={value}>{children}</SystemDesignContext.Provider>;
};

export const useSystemDesign = (): SystemDesignContextType => {
  const context = useContext(SystemDesignContext);
  if (!context) {
    throw new Error('useSystemDesign must be used within SystemDesignProvider');
  }
  return context;
};

