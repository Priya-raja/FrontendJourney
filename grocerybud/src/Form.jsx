import { use, useState } from 'react';
import {useQueryClient, useMutation } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import customFetch from './utils';
const Form = () => {
  const [newItemName, setNewItemName] = useState('');

  const queryClient = useQueryClient();

  const {mutate: createTask, isPending}= useMutation({
    mutationFn: (taskTitle) => customFetch.post('/', {title: taskTitle}),
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['tasks']});
      setNewItemName('');
      toast.success('task created successfully');
    },
    onError: (error) => {
      toast.error(error.response.data.msg || 'something went wrong');
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    createTask(newItemName)
    if (!newItemName) {
      toast.error('please provide value');
      return;
    }
    // addItem(newItemName);
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>grocery bud</h4>
      <div className='form-control'>
        <input
          type='text '
          className='form-input'
          value={newItemName}
          onChange={(event) => setNewItemName(event.target.value)}
        />
        <button type='submit' className='btn'>
          add item
        </button>
      </div>
    </form>
  );
};
export default Form;