import { redirect } from 'next/navigation';

// "Log in" lands here. The home screen is the trip list, since a company usually has several trips.
export default function Dashboard() {
  redirect('/trips');
}
