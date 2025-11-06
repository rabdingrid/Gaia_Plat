import type { SystemDesignProblem } from '../types';

export const MOCK_SYSTEM_DESIGN_PROBLEM: SystemDesignProblem = {
  id: 1,
  title: 'Design a URL Shortener',
  description: 'Design a service like TinyURL or bit.ly that takes a long URL and returns a shortened URL. The service should handle millions of requests per day and provide analytics on URL usage.',
  requirements: [
    'Generate a short, unique URL for a given long URL',
    'Handle 100 million URLs per day',
    'Support URL expiration (optional)',
    'Provide click analytics',
    'Ensure high availability and scalability'
  ]
};

export const fetchSystemDesignProblem = async (): Promise<SystemDesignProblem> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_SYSTEM_DESIGN_PROBLEM);
    }, 500);
  });
};

export const submitSystemDesign = async (
  _problemId: number,
  _excalidrawData: any,
  _notes: string
): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'System design submitted successfully' });
    }, 1000);
  });
};

export const askClarifyingQuestion = async (
  _question: string,
  _problemId: number
): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock AI response
      const responses = [
        'That\'s a great question! Let me clarify: The system should handle high availability and be able to scale horizontally.',
        'Based on the requirements, you should consider the following: database sharding, caching layer, and load balancing.',
        'Good point! You might want to think about the trade-offs between consistency and availability in your design.',
        'Consider the CAP theorem here - you may need to choose between consistency and availability depending on your use case.'
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      resolve(randomResponse);
    }, 1000);
  });
};

