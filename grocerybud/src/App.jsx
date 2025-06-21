import { useState } from 'react';
import Form from './Form';
import { nanoid } from 'nanoid';
import Items from './Items';
import toast, { Toaster } from 'react-hot-toast';



const getLocalStorage = () => {
  try {
    const list = localStorage.getItem('list');
    if (list) {
      const parsed = JSON.parse(list);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (error) {
    console.error('Error parsing localStorage:', error);
    localStorage.removeItem('list');
    return [];
  }
};

const App = () => {
  const [items, setItems] = useState(() => getLocalStorage());

  const setLocalStorage = (items) => {
    try {
      localStorage.setItem('list', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast.error('Failed to save data');
    }
  };

  const addItem = (itemName) => {
    const newItem = {
      name: itemName,
      completed: false,
      id: nanoid(),
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    setLocalStorage(newItems);
    toast.success('Item added to the list');
  };

  const removeItem = (itemId) => {
    const newItems = items.filter((item) => item.id !== itemId);
    setItems(newItems);
    setLocalStorage(newItems);
    toast.success('Item deleted');
  };

  const editItem = (itemId) => {
    const newItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setItems(newItems);
    setLocalStorage(newItems);
  };

  return (
    <section className='section-center'>
      <Form addItem={addItem} />
      <Items items={items} removeItem={removeItem} editItem={editItem} />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </section>
  );
};

export default App;