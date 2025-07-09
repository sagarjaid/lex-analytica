'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import Pricing from '@/components/Pricing';
import ActivePlan from './ActivePlan';

const Plans = () => {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(2);

  const [error, setError] = useState(null);

  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const checkUserAccess = async () => {
      setLoading(true);
      try {
        // Get the current authenticated user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error('No user found');

        // Fetch the user's profile from the 'profiles' table
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('has_access, total_credits')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        console.log(data, 'data');

        // Check if the user has access
        if (data?.has_access) {
          setIsPaidUser(true); // User is a paid user
          setRemainingCredits(data.total_credits);
        } else {
          setIsPaidUser(false); // User is a free user
          setRemainingCredits(data.total_credits);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkUserAccess();
  }, []);

  return (
    <>
      <div className='flex flex-col justify-start items-start text-sm gap-2  xs:text-lg sdm:text-xl sm:gap-3 md:text-2xl px-1'>
        {/* <div className='font-semibold'>Pricing</div> */}

        {isPaidUser ? (
          <>
            {remainingCredits == 0 ? (
              <div className='flex items-center text-sm gap-2'>
                <svg
                  className='w-10 h-10'
                  fill='none'
                  strokeWidth={1.5}
                  stroke='#EF4444'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden='true'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z'
                  />
                </svg>
                <div className='text-red-500'>
                  You have used all paid credits, You can reqvest more FREE
                  Interview credit by writing us on this email id:
                  sagarjaid321@gmail.com
                </div>
              </div>
            ) : (
              <div className='text-base'>
                Manage your plan, check interview credits and more
              </div>
            )}
          </>
        ) : (
          <>
            {remainingCredits == 0 ? (
              <div className='flex items-center justify-center text-sm gap-2'>
                <svg
                  className='w-10 h-10'
                  fill='none'
                  strokeWidth={1.5}
                  stroke='#EF4444'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden='true'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z'
                  />
                </svg>
                <div className='text-red-500'>
                  You have used all FREE credits, Update to Success plan for
                  more interview credits
                </div>
              </div>
            ) : (
              <div className='text-base'>
                Upgrade to become visa ready with our success plan
              </div>
            )}
          </>
        )}
      </div>

      <div className='flex flex-col justify-start mt-10'>
        {isPaidUser && !loading && <ActivePlan />}

        {!isPaidUser && !loading && <Pricing hide={true} />}
      </div>

    </>
  );
};

export default Plans;
