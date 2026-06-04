import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course } from '../modules/learning/learning.model';
import { MONGODB_URI } from '../config/env';

dotenv.config();

const courses = [
  {
    title: 'Python for Beginners',
    description:
      'Master Python from scratch. Build real projects, automate tasks, and unlock the most in-demand programming skill.',
    category: 'Python',
    level: 'beginner',
    instructor: 'Sarah Okafor',
    totalLessons: 8,
    modules: [
      {
        title: 'Python Basics',
        order: 1,
        lessons: [
          {
            order: 1,
            title: 'What is Python?',
            content:
              'Python is a high-level, interpreted programming language known for its simplicity and readability.',
            estimatedMinutes: 10,
          },
          {
            order: 2,
            title: 'Variables and Data Types',
            content:
              'Variables store data values. Python has no command for declaring a variable — it is created the moment you assign a value.',
            estimatedMinutes: 12,
          },
          {
            order: 3,
            title: 'Basic Input and Output',
            content:
              'Use print() to display output and input() to receive user input in Python.',
            estimatedMinutes: 10,
          },
          {
            order: 4,
            title: 'String Manipulation',
            content:
              'Strings in Python are arrays of bytes representing unicode characters. Python has many built-in string methods.',
            estimatedMinutes: 15,
          },
        ],
      },
      {
        title: 'Control Flow',
        order: 2,
        lessons: [
          {
            order: 1,
            title: 'If Statements',
            content:
              'An if statement is used for conditional execution. It checks a condition and executes a block of code if true.',
            estimatedMinutes: 12,
          },
          {
            order: 2,
            title: 'Loops in Python',
            content:
              'Python has two primitive loop commands: the while loop and the for loop. Use them to iterate over sequences.',
            estimatedMinutes: 15,
          },
          {
            order: 3,
            title: 'Functions',
            content:
              'A function is a block of code which only runs when it is called. You can pass data into a function as parameters.',
            estimatedMinutes: 18,
          },
          {
            order: 4,
            title: 'Lists and Dictionaries',
            content:
              'Lists store multiple items in a single variable. Dictionaries store key-value pairs and are used to store data values.',
            estimatedMinutes: 20,
          },
        ],
      },
    ],
  },
  {
    title: 'Web Dev Bootcamp',
    description:
      'Go from zero to full-stack web developer. Learn HTML, CSS, JavaScript, and React with hands-on projects.',
    category: 'Web Dev',
    level: 'beginner',
    instructor: 'John Adeyemi',
    totalLessons: 9,
    modules: [
      {
        title: 'HTML Fundamentals',
        order: 1,
        lessons: [
          {
            order: 1,
            title: 'HTML Structure',
            content:
              'HTML is the standard markup language for creating web pages. Every HTML document starts with a DOCTYPE declaration.',
            estimatedMinutes: 10,
          },
          {
            order: 2,
            title: 'HTML Elements and Tags',
            content:
              'HTML elements are the building blocks of HTML pages. They are represented by tags like h1, p, div, and span.',
            estimatedMinutes: 12,
          },
          {
            order: 3,
            title: 'HTML Forms',
            content:
              'HTML forms are used to collect user input. The form element defines a form that contains input elements.',
            estimatedMinutes: 15,
          },
        ],
      },
      {
        title: 'CSS Styling',
        order: 2,
        lessons: [
          {
            order: 1,
            title: 'CSS Selectors',
            content:
              'CSS selectors are used to find the HTML elements you want to style. Types include element, class, and id selectors.',
            estimatedMinutes: 12,
          },
          {
            order: 2,
            title: 'Box Model and Layout',
            content:
              'The CSS box model wraps every HTML element. It consists of margins, borders, padding, and the actual content.',
            estimatedMinutes: 15,
          },
          {
            order: 3,
            title: 'Flexbox',
            content:
              'Flexbox is a CSS layout module that provides an efficient way to lay out, align and distribute space among items.',
            estimatedMinutes: 18,
          },
        ],
      },
      {
        title: 'JavaScript Basics',
        order: 3,
        lessons: [
          {
            order: 1,
            title: 'JavaScript Variables',
            content:
              'Variables are containers for storing data values. In JavaScript, you can declare variables using var, let, or const.',
            estimatedMinutes: 10,
          },
          {
            order: 2,
            title: 'DOM Manipulation',
            content:
              'The Document Object Model (DOM) is a programming interface for HTML. JavaScript can change all HTML elements and attributes.',
            estimatedMinutes: 20,
          },
          {
            order: 3,
            title: 'Events and Listeners',
            content:
              'HTML events are things that happen to HTML elements. JavaScript can react to these events using event listeners.',
            estimatedMinutes: 18,
          },
        ],
      },
    ],
  },
  {
    title: 'UI/UX Design Mastery',
    description:
      'Learn to design beautiful, user-friendly interfaces. Master Figma, design principles, and UX research methods.',
    category: 'UI/UX',
    level: 'beginner',
    instructor: 'Tolu Bello',
    totalLessons: 6,
    modules: [
      {
        title: 'Design Fundamentals',
        order: 1,
        lessons: [
          {
            order: 1,
            title: 'Design Principles',
            content:
              'Good design follows core principles: balance, contrast, emphasis, movement, pattern, rhythm, and unity.',
            estimatedMinutes: 12,
          },
          {
            order: 2,
            title: 'Color Theory',
            content:
              'Color theory is a body of practical guidance for color mixing and the visual effects of specific color combinations.',
            estimatedMinutes: 15,
          },
          {
            order: 3,
            title: 'Typography Basics',
            content:
              'Typography is the art of arranging type. It involves font selection, line spacing, letter spacing, and type size.',
            estimatedMinutes: 10,
          },
        ],
      },
      {
        title: 'Figma Essentials',
        order: 2,
        lessons: [
          {
            order: 1,
            title: 'Figma Interface Overview',
            content:
              'Figma is a vector-based design tool. The interface includes the toolbar, layers panel, canvas, and properties panel.',
            estimatedMinutes: 12,
          },
          {
            order: 2,
            title: 'Creating Components',
            content:
              'Components in Figma are reusable UI elements. They help maintain consistency and speed up your design workflow.',
            estimatedMinutes: 18,
          },
          {
            order: 3,
            title: 'Prototyping in Figma',
            content:
              "Figma's prototyping features let you create interactive flows that simulate how a user interacts with your designs.",
            estimatedMinutes: 20,
          },
        ],
      },
    ],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    await Course.deleteMany({});
    await Course.insertMany(courses);
    console.log('✅ Courses seeded successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
