import SingleItem from './SingleItem';
import {useQuery} from '@tanstack/react-query'
import customFetch from './utils'

const Items = ({ removeItem, editItem }) => {

  const {isPending,isError, data} = useQuery({
    queryKey:['tasks'], 
    queryFn: async () => await customFetch.get('/')
  })
if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error loading tasks</div>;

  // Use the fetched data
  

  console.log(data)
  return (
    <div className='items'>
      {data.data.taskList.map((item) => {
        return (
          <SingleItem
            key={item.id}
            item={item}
            removeItem={removeItem}
            
          />
        );
      })}
    </div>
  );
};
export default Items;