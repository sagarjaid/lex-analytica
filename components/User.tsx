/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

'use client';

import { useState, useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import apiClient from '@/lib/api';
import { Link } from 'lucide-react';
import { usePathname } from 'next/navigation';

// A button to show user some account actions
//  1. Billing: open a Stripe Customer Portal to manage their billing (cancel subscription, update payment method, etc.).
//     You have to manually activate the Customer Portal in your Stripe Dashboard (https://dashboard.stripe.com/test/settings/billing/portal)
//     This is only available if the customer has a customerId (they made a purchase previously)
//  2. Logout: sign out and go back to homepage
// See more at https://shipfa.st/docs/components/buttonAccount
const UserInfo = () => {
  const pathName = usePathname();

  const supabase = createClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleBilling = async () => {
    setIsLoading(true);

    try {
      const { url }: { url: string } = await apiClient.post(
        '/lemonsqueezy/create-portal',
        {
          returnUrl: window.location.href,
        }
      );

      if (url) {
        window.open(url, '_blank');
      } else {
        window.open('https://app.lemonsqueezy.com/my-orders', '_blank');
      }
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  };

  console.log(user, 'user');

  const pricingSvg = (
    <svg
      className='w-5 h-5'
      fill='none'
      strokeWidth={1.5}
      stroke='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3'
      />
    </svg>
  );

  const historySvg = (
    <svg
      className='w-5 h-5'
      fill='none'
      strokeWidth={1.5}
      stroke='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3'
      />
    </svg>
  );

  const dashboardSvg = (
    <svg
      className='w-5 h-5'
      fill='none'
      strokeWidth={1.5}
      stroke='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z'
      />
    </svg>
  );

  const accountSvg = (
    <svg
      className='w-5 h-5'
      fill='none'
      strokeWidth={1.5}
      stroke='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
      />
    </svg>
  );

  const fillters = [
    {
      name: 'Dashboard',
      svg: dashboardSvg,
      slug: '/dash',
    },
    {
      name: 'History',
      svg: historySvg,
      slug: '/history',
    },
    {
      name: 'Pricing',
      svg: pricingSvg,
      slug: '/pricing',
    },
    {
      name: 'Account',
      svg: accountSvg,
      slug: '/account',
    },
  ];

  return (
    <>
      <div className='overflow-hidden  bg-base-100 p-1 w-full'>
        <div className='space-y-2 text-sm'>
          <div className='flex flex-col gap-2 p-2   w-full rounded-lg font-medium'>
            {user?.user_metadata?.avatar_url ?
              <img
                src={user?.user_metadata?.avatar_url}
                alt={'Profile picture'}
                className='w-24 h-24 rounded-full shrink-0'
                referrerPolicy='no-referrer'
              />
            : <svg
                className='w-24 h-24'
                fill='none'
                strokeWidth={1.5}
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                />
              </svg>
            }

            <span className='pt-2'>
              Name :{' '}
              {user?.user_metadata?.name ||
                user?.email?.split('@')[0] ||
                'User'}
            </span>

            {user?.email && <span>Email : {user?.email}</span>}

            {user?.phone && <span>Phone : +{user?.phone}</span>}
            <hr className='mt-3' />
            {/* <span>Upload your cv/resume: coming soon...</span> */}
          </div>

          {/* <button
            className='flex items-center gap-2 hover:bg-base-300 duration-200 p-1.5   w-full rounded-lg font-medium'
            onClick={() => (window.location.href = '/pricing')}>
            <svg
              className='w-5 h-5'
              fill='none'
              strokeWidth={1.5}
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3'
              />
            </svg>
            Pricing
          </button> */}

          <button
            className='flex items-center gap-2 hover:bg-base-300 duration-200 p-1.5   w-full rounded-lg font-medium'
            onClick={handleBilling}>
            <svg
              className='w-5 h-5'
              fill='none'
              strokeWidth={1.5}
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3'
              />
            </svg>
            {isLoading ? 'Redirecting..' : 'Manage Billing'}
          </button>

          <button
            className='flex items-center gap-2 hover:bg-error/20 hover:text-error duration-200 p-1.5 w-full rounded-md font-medium'
            onClick={handleSignOut}>
            <svg
              className='w-5 h-5'
              fill='none'
              strokeWidth={1.5}
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9'
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default UserInfo;
