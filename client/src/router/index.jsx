import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import EventDetailPage from '../pages/EventDetailPage';
import ChatRoomPage from '../pages/ChatRoomPage';
import ProfilePage from '../pages/ProfilePage';
import AuthPage from '../pages/AuthPage';

const AboutPage = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <h1>Hakkında</h1>
    <p>Friendly WebGIS Platform</p>
  </div>
);

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/events', element: <EventDetailPage /> },
  { path: '/events/:id', element: <EventDetailPage /> },
  { path: '/chat/:id', element: <ChatRoomPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/auth', element: <AuthPage /> },
  { path: '/about', element: <AboutPage /> }
]);

export default router;
