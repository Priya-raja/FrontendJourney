// api/tasks.js - Handles /api/tasks
import { nanoid } from 'nanoid';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'api/data/tasks.json');

// Initial data (same as your server.js)
const initialTasks = [
  { id: nanoid(), title: 'walk the dog', isDone: false },
  { id: nanoid(), title: 'wash dishes', isDone: false },
  { id: nanoid(), title: 'drink coffee', isDone: true },
  { id: nanoid(), title: 'take a nap', isDone: false },
];

const readTasksFromFile = async () => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with initial data
    await writeTasksToFile(initialTasks);
    return initialTasks;
  }
};

const writeTasksToFile = async (tasks) => {
  try {
    // Ensure directory exists
    const dir = path.dirname(dataFilePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error writing tasks:', error);
  }
};

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
        const taskList = await readTasksFromFile();
        res.status(200).json({ taskList });
        break;

      case 'POST':
        const { title } = req.body;
        if (!title) {
          res.status(400).json({ msg: 'please provide title' });
          return;
        }
        
        let currentTasks = await readTasksFromFile();
        const newTask = { id: nanoid(), title, isDone: false };
        currentTasks = [...currentTasks, newTask];
        
        await writeTasksToFile(currentTasks);
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