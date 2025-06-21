// api/tasks.js - In-memory storage for Vercel
import { nanoid } from 'nanoid';

// In-memory storage (resets on deployment)
let taskList = [
  { id: nanoid(), title: 'walk the dog', isDone: false },
  { id: nanoid(), title: 'wash dishes', isDone: false },
  { id: nanoid(), title: 'drink coffee', isDone: true },
  { id: nanoid(), title: 'take a nap', isDone: false },
];

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        res.status(200).json({ taskList });
        break;

      case 'POST':
        const { title } = req.body;
        if (!title) {
          res.status(400).json({ msg: 'please provide title' });
          return;
        }
        
        const newTask = { id: nanoid(), title, isDone: false };
        taskList = [...taskList, newTask];
        
        res.status(201).json({ task: newTask });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}