import { Suspense } from 'react';
import Header from '@/components/Header';
// import ButtonSubmitYT from '@/components/ButtonSubmitYT';
// import ChannelList from '@/components/ChannelList';
// import Navbar from '@/components/Navbar';
// import VisaInterviewTwo from '@/components/core/visaInterviewTwo';
// import VisaInterview from '@/components/core/visaInterview';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';
// import Headline from '@/components/Headline';
import Headline from '@/components/Headline';

import Hero from '@/components/Hero';
    import Problem from '@/components/Problem';
import FeaturesAccordion from '@/components/FeaturesAccordion';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import Plan from '@/components/Pricing';
import Plans from '@/components/Plans';
// import PricingOld from '@/components/Pricing-old';

export default function Home() {
  const handleSignOut = () => {
    console.log('sign out');
  }
  return (
    <>
      <main className='flex flex-col gap-4 items-center w-full justify-center bg-gradient-to-t from-white via-green-50 to-white'>
        {/* <div className='bg-green-500 text-white text-sm w-full flex justify-center items-center p-2 py-3'>
          We are working on few new features, Errors may occur
        </div> */}
        <div className='flex max-w-5xl w-full gap-4 flex-col items-center justify-center '>
          <Suspense>
            {/* <Header handleSignOut={handleSignOut} user={null} router={null} /> */}
          </Suspense>
        </div>
        <div className='flex flex-col items-center w-full justify-center  bg-gradient-to-t from-white via-green-100 to-white'>
          <div className='flex max-w-5xl w-full flex-col items-center justify-center '>
            <div className='flex flex-col text-center items-center p-4 pt-20  font-bold text-2xl sdm:text-3xl sm:gap-3 md:text-4xl mdx:text-5xl '>
            <Headline />
            </div>
            {/* Phone mockup and input section */}
            <div className='flex flex-col items-center gap-4 pt-6'>
              <div className='relative flex flex-col items-center'>
                {/* Phone mockup placeholder */}
                <div className='w-40 h-80 rounded-3xl border-4 border-gray-300 bg-white shadow-lg flex flex-col items-center justify-end p-4 mb-2'>
                  <div className='w-32 h-56 bg-gray-100 rounded-2xl flex items-center justify-center'>
                    <span className='text-gray-400 text-sm'>Your AI Call Reminder</span>
                  </div>
                  <div className='w-16 h-2 bg-gray-300 rounded-full mt-4 mb-1'></div>
                </div>
                {/* Phone number input overlay */}
                <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center w-36'>
                  <input
                    type='tel'
                    placeholder='Enter phone number'
                    className='w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-200 text-sm mb-2'
                  />
                  <button
                    type='submit'
                    className='w-full bg-green-400 hover:bg-green-300 text-white font-semibold py-1.5 rounded-lg text-sm transition-colors'>
                    Get AI Reminders
                  </button>
                </div>
              </div>
            </div>
            {/* End phone mockup and input section */}
            <div className='flex flex-col items-center gap-4 pt-6 text-center text-gray-600 sm:text-base'>
              <a href='/'>
                <img
                  src='/usedby.png'
                  className='w-[200px]'
                />
              </a>
              <p className='text-center text-xs sm:text-base'>
                289+ goals reminded yesterday
              </p>

              <a
                href='/signin'
                className='flex items-center gap-2 bg-green-300 text-black hover:bg-green-200 p-2 px-3.5 border cursor-pointer border-white rounded-full'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-6 h-6'
                  viewBox='0 0 48 48'>
                  <path
                    fill='#00000'
                    d='M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z'
                  />
                  <path
                    fill='#00000'
                    d='m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z'
                  />
                  <path
                    fill='#00000'
                    d='M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z'
                  />
                  <path
                    fill='#00000'
                    d='M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z'
                  />
                </svg>
                <span>Continue with Google</span>
              </a>

              <div className='flex flex-col gap-2'>
                <span className='text-xs'>
                  ✓ Never Lose Sight of Goals, Tasks and Habits
                </span>
                <span className='text-xs'>
                  ✓ Let AI do the followups on your goals
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className='flex max-w-5xl w-full gap-4 flex-col items-center justify-center '>
          <a
            href='/signin'
            className='flex justify-center items-center w-full'>
            <img
              src='/aicalling-2.png'
              className='w-[90%] sdm:w-2/3'
            />
          </a>

          <Problem />

          {/* <FeaturesAccordion /> */}

          {/* <Pricing hide={true} /> */}

          {/* <div className=' w-full flex items-center justify-center'>
            <div className=' m-4 flex max-w-4xl flex-col items-center text-center justify-center gap-4 rounded-2xl bg-blue-500 p-8 text-white'>
              <div className='mt-4 text-3xl font-bold'>
                Take the first step toward your dream career today!
              </div>
              <p className='max-w-lg text-center'>
                Start practicing now, ace the interview and achieve your
                educational goals and make your dream of studying in the US a
                reality
              </p>
              <a
                href='/interview/91739730173'
                className='flex gap-2 bg-white hover:bg-slate-50 p-2 px-3.5 text-black border cursor-pointer border-black rounded-full'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-6 h-6'
                  viewBox='0 0 48 48'>
                  <path
                    fill='#FFC107'
                    d='M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z'
                  />
                  <path
                    fill='#FF3D00'
                    d='m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z'
                  />
                  <path
                    fill='#4CAF50'
                    d='M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z'
                  />
                  <path
                    fill='#1976D2'
                    d='M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z'
                  />
                </svg>
                <span>Continue with Google</span>
              </a>
            </div>
          </div> */}
        </div>

        <Pricing hide={false} />
        {/* <FAQ /> */}

        {/* <CtaBox /> */}
      </main>
      {/* <FooterBIg /> */}
      <Footer />
    </>
  );
}
