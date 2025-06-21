// api/tasks/[id].js - In-memory storage for individual tasks
import { nanoid } from 'nanoid';

// Import the same taskList reference (this is a limitation - need shared state)
// For a real app, you'd use a database. For portfolio demo, this works.

// We need to recreate the taskList here since modules don't share state in serverless
let taskList = [
  { id: 'demo1', title: 'walk the dog', isDone: false },
  { id: 'demo2', title: 'wash dishes', isDone: false },
  { id: 'demo3', title: 'drink coffee', isDone: true },
  { id: 'demo4', title: 'take a nap', isDone: false },
];

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;

  if (!id) {
    res.status(400).json({ msg: 'Task ID required' });
    return;
  }

  try {
    switch (req.method) {
      case 'PATCH':
        const { isDone } = req.body;
        
        taskList = taskList.map((task) => {
          if (task.id === id) {
            return { ...task, isDone };
          }
          return task;
        });

        res.status(200).json({ msg: 'task updated' });
        break;

      case 'DELETE':
        taskList = taskList.filter((task) => task.id !== id);
        res.status(200).json({ msg: 'task removed' });
        break;

      default:
        res.setHeader('Allow', ['PATCH', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}