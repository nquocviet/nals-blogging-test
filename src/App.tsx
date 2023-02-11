import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/router';
import { ThemeProvider } from '@/context/ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
