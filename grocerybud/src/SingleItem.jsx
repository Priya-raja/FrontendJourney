import {useQueryClient,useMutation } from "@tanstack/react-query";
import customFetch from './utils'

const SingleItem = ({ item }) => { // Remove removeItem prop - not used
  const queryClient = useQueryClient();

  const {mutate: editTask} = useMutation({
  mutationFn: ({id, isDone}) => customFetch.patch(`/?id=${id}`, {isDone}), // Add ?id= 
  onSuccess: () => {
    console.log('✅ Task updated, invalidating cache...');
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
  onError: (error) => {
    console.error('Error updating item:', error);
  }
})

const {mutate: removeTask} = useMutation({
  mutationFn: (id) => customFetch.delete(`/?id=${id}`), // Add ?id=
  onSuccess: () => {
    console.log('✅ Task deleted, invalidating cache...');
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
  onError: (error) => {
    console.error('Error deleting item:', error);
  }
})

  return (
    <div className='single-item'>
      <input
        type='checkbox'
        checked={item.isDone}
        onChange={() => editTask({id:item.id, isDone: !item.isDone})}
      />
      <p
        style={{
          textTransform: 'capitalize',
          textDecoration: item.isDone && 'line-through',
        }}
      >
        {item.title}
      </p>
      <button
        className='btn remove-btn'
        type='button'
        onClick={() => removeTask(item.id)}
      >
        delete
      </button>
    </div>
  );
};
export default SingleItem;