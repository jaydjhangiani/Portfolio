import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Resume from './pages/Resume.jsx';
import Home from './pages/Home.jsx';

const router = createBrowserRouter([
  // {
  //   path: '/',
  //   element: <App />,
  //   // errorElement: <NotFoundPage />,
  // },

  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
