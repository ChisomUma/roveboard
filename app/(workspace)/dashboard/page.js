'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../store';

// Where "Log in" lands: the first trip's overview, or the trip list if there are none.
export default function Dashboard() {
  const { trips } = useStore();
  const router = useRouter();
  useEffect(() => {
    router.replace(trips[0] ? `/trips/${trips[0].id}` : '/trips');
  }, [trips, router]);
  return null;
}
