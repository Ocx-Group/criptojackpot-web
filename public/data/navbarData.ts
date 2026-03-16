import { v4 as uuidv4 } from 'uuid';

export const navbarData = [
  {
    id: uuidv4(),
    menuTitle: 'Home',
    menuTitleKey: 'NAVBAR.Home',
    path: '/',
  },
  {
    id: uuidv4(),
    menuTitle: 'Lotteries',
    menuTitleKey: 'NAVBAR.Lotteries',
    path: '/landing-page',
  },
  {
    id: uuidv4(),
    menuTitle: 'Login',
    menuTitleKey: 'NAVBAR.Login',
    path: '/login',
  },
  {
    id: uuidv4(),
    menuTitle: 'Register',
    menuTitleKey: 'NAVBAR.Register',
    path: '/register',
  },
];
