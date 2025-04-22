"use client";

import { useUser } from '@clerk/nextjs';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { checkOnboardingStatusBedrijf } from '@/lib/actions/bedrijf.actions';
import { checkOnboardingStatusFreelancer } from '@/lib/actions/nieuwkomer.actions';

const NieuwkomerDashboard = dynamic(() => import('@/app/dashboard/werkzoekende/page'));
const GemeenteDashboard = dynamic (() => import ('@/app/dashboard/gemeenten/page'));
const BedrijvenDashboard = dynamic(() => import('@/app/dashboard/bedrijven/page'));
const NotFoundPage = dynamic(() => import('@/app/not-found'))

const DashboardPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [typeGebruiker, setTypeGebruiker] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    if (
        user?.organizationMemberships?.length > 0 &&
        typeof user.unsafeMetadata.typeGebruiker === 'string'
      ) {
        setTypeGebruiker(user.unsafeMetadata.typeGebruiker);
      }
       else {
        setTypeGebruiker('nieuwkomer');
    }
  }, [isLoaded, isSignedIn, user, router]);

  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      if (typeGebruiker === null) return;
      try {
        const userId = user?.id;
        if (!userId) throw new Error('User ID missing');

        const response = typeGebruiker === 'bedrijf'
          ? await checkOnboardingStatusBedrijf(userId)
          : await checkOnboardingStatusFreelancer(userId);
        setIsOnboarded(response);
        setIsLoading(false)
      } catch (error) {
        console.error('Error:', error);
        router.push('/sign-in');
      }
    };
    fetchOnboardingStatus();
  }, [typeGebruiker, user, router]);

  // Redirect based on state
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push('/sign-in');
    } else if (isOnboarded === false) {
      router.push('/verifieren');
    }
  }, [isLoaded, isSignedIn, isOnboarded, router]);

  if (!isLoaded || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {
      typeGebruiker === 'nieuwkomer' ?  <NieuwkomerDashboard />
       : typeGebruiker === 'bedrijf' ? <BedrijvenDashboard /> 
       : typeGebruiker === 'gemeente' ? <GemeenteDashboard/>
       : <NotFoundPage/>
       }
    </div>
  );
};

export default DashboardPage;

