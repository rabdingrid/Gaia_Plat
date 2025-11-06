import type { CodingProblem } from '../types';

export const MOCK_CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Medium',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    boilerplate: {
      python: `def twoSum(nums, target):
    # Write your code here
    pass`,
      javascript: `function twoSum(nums, target) {
    // Write your code here
    
}`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
}`
    },
    testCases: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      },
      {
        input: 'nums = [1,5,3,7,2], target = 9',
        output: '[3,4]'
      }
    ]
  },
  {
    id: 2,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]'
      },
      {
        input: 'head = [1,2]',
        output: '[2,1]'
      }
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    boilerplate: {
      python: `def reverseList(head):
    # Write your code here
    pass`,
      javascript: `function reverseList(head) {
    // Write your code here
    
}`,
      java: `class Solution {
    public ListNode reverseList(ListNode head) {
        // Write your code here
        
    }
}`
    },
    testCases: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]'
      },
      {
        input: 'head = [1,2]',
        output: '[2,1]'
      }
    ]
  },
  {
    id: 3,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    boilerplate: {
      python: `def isValid(s):
    # Write your code here
    pass`,
      javascript: `function isValid(s) {
    // Write your code here
    
}`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your code here
        
    }
}`
    },
    testCases: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ]
  },
  {
    id: 4,
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
      },
      {
        input: 'nums = [1]',
        output: '1'
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    boilerplate: {
      python: `def maxSubArray(nums):
    # Write your code here
    pass`,
      javascript: `function maxSubArray(nums) {
    // Write your code here
    
}`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your code here
        
    }
}`
    },
    testCases: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6'
      },
      {
        input: 'nums = [1]',
        output: '1'
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23'
      }
    ]
  }
];

export const fetchCodingProblems = async (): Promise<CodingProblem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CODING_PROBLEMS);
    }, 500);
  });
};

export const runCode = async (
  _code: string,
  _language: string,
  _problemId: number
): Promise<{ output: string; testResults: Array<{ input: string; expectedOutput: string; actualOutput: string; passed: boolean }> }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock execution - in real app, this would execute code on backend
      resolve({
        output: 'Code executed successfully',
        testResults: []
      });
    }, 1000);
  });
};

export const submitSolution = async (
  _problemId: number,
  _code: string,
  _language: string
): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Solution submitted successfully' });
    }, 1000);
  });
};

