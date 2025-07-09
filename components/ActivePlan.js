'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const ActivePlan = () => {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [totalCredits, setTotalCredits] = useState(0);
  const [usedCredits, setUsedCredits] = useState(0);
  const [remainingCredits, setRemainingCredits] = useState(0);
  const [error, setError] = useState(null);

  const pathName = usePathname();

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

        // Check if the user has access
        if (data?.has_access) {
          setIsPaidUser(true); // User is a paid user
          if (data?.total_credits == 20) {
            setTotalCredits(20);
            setRemainingCredits(data.total_credits);
            setUsedCredits(0);
          } else {
            setTotalCredits(20);
            setUsedCredits(20 - data.total_credits);
            setRemainingCredits(data.total_credits);
          }
        } else {
          setIsPaidUser(false); // User is a free user
          if (data?.total_credits == 2) {
            setTotalCredits(2);
            setRemainingCredits(2);
            setUsedCredits(0);
          } else {
            setTotalCredits(2);
            setUsedCredits(2 - data.total_credits);
            setRemainingCredits(data.total_credits);
          }
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
      <div className=' flex flex-col items-start border shadow border-gray-100 w-full h-fit rounded-md'>
        <div className='flex w-full flex-col gap-1.5 p-3 pb-3.5'>
          <div className='flex w-full justify-between items-center'>
            <h2 className='text-base font-semibold'>Active Plan</h2>
            {/* <h2 className='text-base font-semibold'>SUCCESS Plan</h2> */}

            {isPaidUser ? (
              <a
                href='/account'
                className='border border-black bg-black text-white text-[9px] px-2 py-0.5 rounded-full'>
                Manage Plan
              </a>
            ) : (
              <a
                href='/pricing'
                className='border border-black bg-black text-white text-[9px] px-2 py-0.5 rounded-full'>
                Upgrade
              </a>
            )}

            {/* <span className='border border-black  bg-black text-white text-[9px] px-2 py-0.5 rounded-full'>
                      Upgrade
                    </span> */}
          </div>
          <div className='text-xs font-medium '>
            {' '}
            {isPaidUser ? 'Success Plan' : 'Free Plan'}
          </div>
          <div className='text-xs  '>Interview credits:</div>
          <hr />

          <div className='text-xs mt-0.5'>Total : {totalCredits}</div>
          <div className='text-xs'>Used : {usedCredits}</div>
          <div className='text-xs'>Remaining : {remainingCredits}</div>
        </div>
      </div>
    </>
  );
};

export default ActivePlan;
