// api/tasks.js - Single API file for all operations
import { nanoid } from 'nanoid';

// In-memory storage (shared across all operations in this file)
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
    const { id } = req.query; // Get ID from query params

    switch (req.method) {
      case 'GET':
        console.log('📋 Current taskList:', taskList);
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
        
        console.log('✅ Task added. New taskList:', taskList);
        res.status(201).json({ task: newTask });
        break;

      case 'PATCH':
        if (!id) {
          res.status(400).json({ msg: 'Task ID required for PATCH' });
          return;
        }
        
        const { isDone } = req.body;
        console.log(`🔄 Updating task ${id} to isDone: ${isDone}`);
        
        taskList = taskList.map((task) => {
          if (task.id === id) {
            return { ...task, isDone };
          }
          return task;
        });

        console.log('✅ Task updated. New taskList:', taskList);
        res.status(200).json({ msg: 'task updated' });
        break;

      case 'DELETE':
        if (!id) {
          res.status(400).json({ msg: 'Task ID required for DELETE' });
          return;
        }
        
        console.log(`🗑️ Deleting task ${id}`);
        const initialLength = taskList.length;
        taskList = taskList.filter((task) => task.id !== id);
        
        console.log(`✅ Task deleted. Removed ${initialLength - taskList.length} items. New taskList:`, taskList);
        res.status(200).json({ msg: 'task removed' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}