import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production' 
  ? '/api/tasks' 
  : 'http://localhost:5002/api/tasks';

const customFetch = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default customFetch;