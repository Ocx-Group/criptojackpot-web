import { redirect } from 'next/navigation';

// Route renamed to /my-tickets
export default function UserPanelRedirect() {
  redirect('/my-tickets');
}
