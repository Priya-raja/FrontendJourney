// api/tasks/[id].js - Handles /api/tasks/:id
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'api/data/tasks.json');

const readTasksFromFile = async () => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tasks:', error);
    return [];
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
        let tasks = await readTasksFromFile();
        
        tasks = tasks.map((task) => {
          if (task.id === id) {
            return { ...task, isDone };
          }
          return task;
        });

        await writeTasksToFile(tasks);
        res.status(200).json({ msg: 'task updated' });
        break;

      case 'DELETE':
        let deleteTasks = await readTasksFromFile();
        deleteTasks = deleteTasks.filter((task) => task.id !== id);
        
        await writeTasksToFile(deleteTasks);
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