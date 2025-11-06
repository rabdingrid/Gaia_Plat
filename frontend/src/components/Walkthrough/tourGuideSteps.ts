import type { TourStep } from '../../context/TourContext';

export const mcqTourSteps: TourStep[] = [
  {
    target: '[data-tour="header"]',
    title: 'Welcome to MCQ Assessment',
    content: 'This is the header section. You can see the timer and submit button here.',
    placement: 'bottom'
  },
  {
    target: '[data-tour="progress-bar"]',
    title: 'Progress Indicator',
    content: 'This yellow bar shows your progress based on answered questions.',
    placement: 'bottom'
  },
  {
    target: '[data-tour="sidebar"]',
    title: 'Question Navigation',
    content: 'Use this sidebar to navigate between questions. Green = answered, Purple = marked for review, Yellow = not answered.',
    placement: 'right'
  },
  {
    target: '[data-tour="question-card"]',
    title: 'Question Area',
    content: 'Read the question here and select your answer from the options below.',
    placement: 'left'
  },
  {
    target: '[data-tour="submit-button"]',
    title: 'MCQ Tutorial Complete!',
    content: 'You have finished the MCQ tutorial.',
    placement: 'center'
  }
];

export const codingTourSteps: TourStep[] = [
  {
    target: '[data-tour="header"]',
    title: 'Welcome to Coding Assessment',
    content: 'This is the header section. You can see the timer and submit button here.',
    placement: 'bottom'
  },
  {
    target: '[data-tour="progress-bar"]',
    title: 'Progress Indicator',
    content: 'This yellow bar shows your progress through the coding problems.',
    placement: 'bottom'
  },
  {
    target: '[data-tour="question-nav"]',
    title: 'Question Navigation',
    content: 'Use these buttons to switch between different coding problems.',
    placement: 'bottom'
  },
  {
    target: '[data-tour="problem-description"]',
    title: 'Problem Description',
    content: 'Read the problem statement, examples, and constraints here.',
    placement: 'right'
  },
  {
    target: '[data-tour="code-editor"]',
    title: 'Code Editor',
    content: 'Write your solution here. You can select different programming languages.',
    placement: 'left'
  },
  {
    target: '[data-tour="test-cases"]',
    title: 'Test Cases',
    content: 'View test cases and run your code to see the results here.',
    placement: 'top'
  },
  {
    target: '[data-tour="submit-button"]',
    title: 'Coding Tutorial Complete!',
    content: 'You have finished the Coding tutorial.',
    placement: 'center'
  }
];

export const systemDesignTourSteps: TourStep[] = [
  {
    target: '[data-tour="header"]',
    title: 'Welcome to System Design Assessment',
    content: 'This is the header section. You can see the timer and submit button here.',
    placement: 'bottom'
  },
  {
    target: '[data-tour="progress-bar"]',
    title: 'Progress Indicator',
    content: 'This yellow bar shows your progress through the system design problem.',
    placement: 'bottom'
  },
  {
    target: '[data-tour="problem-description"]',
    title: 'Problem Description',
    content: 'Read the system design problem and requirements here.',
    placement: 'bottom'
  },
  {
    target: '[data-tour="canvas"]',
    title: 'Design Canvas',
    content: 'Use this Excalidraw canvas to create your system architecture diagram. Draw components, connections, and annotations.',
    placement: 'bottom'
  },
  {
    target: '[data-tour="chat"]',
    title: 'Clarifying Questions',
    content: 'Ask clarifying questions about the requirements using this chat interface.',
    placement: 'left'
  },
  {
    target: '[data-tour="submit-button"]',
    title: 'System Design Tutorial Complete!',
    content: 'Perfect! You\'ve completed all tutorials. Are you ready to start the test? Click "Start Test" when you\'re ready!',
    placement: 'center'
  }
];

