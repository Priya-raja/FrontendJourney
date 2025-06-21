// App.js
import Form from './Form';
import Items from './Items';
import toast, { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <section className='section-center'>
      <Form />
      <Items />
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