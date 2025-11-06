import type { Question } from '../types';

export const QUESTION_STATUS = {
  NOT_ANSWERED: 'not_answered',
  ANSWERED: 'answered',
  MARKED: 'marked'
} as const;

export const TIMER_DURATION = 60 * 60; // 60 minutes in seconds

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    topic: 'Data Structures',
    question: 'What is the time complexity of binary search in a sorted array?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correctAnswer: 1
  },
  {
    id: 2,
    topic: 'Algorithms',
    question: 'What is the worst-case time complexity of quicksort?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(n log n)'],
    correctAnswer: 2
  },
  {
    id: 3,
    topic: 'Data Structures',
    question: 'Which data structure uses LIFO principle?',
    options: ['Queue', 'Stack', 'Tree', 'Graph'],
    correctAnswer: 1
  },
  {
    id: 4,
    topic: 'Algorithms',
    question: 'What is the space complexity of merge sort?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 2
  },
  {
    id: 5,
    topic: 'Data Structures',
    question: 'What is the time complexity of inserting an element in a hash table?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 0
  },
  {
    id: 6,
    topic: 'Algorithms',
    question: 'Which algorithm is used for finding shortest path in a graph?',
    options: ['BFS', 'DFS', 'Dijkstra', 'All of the above'],
    correctAnswer: 3
  },
  {
    id: 7,
    topic: 'Data Structures',
    question: 'What is the maximum number of nodes in a binary tree of height h?',
    options: ['2^h', '2^h - 1', 'h^2', '2h'],
    correctAnswer: 1
  },
  {
    id: 8,
    topic: 'Algorithms',
    question: 'What is the time complexity of bubble sort?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(n log n)'],
    correctAnswer: 2
  }
];

