'use client';
import config from '@/config';
import ButtonCheckout from './ButtonCheckout';
import { useState } from 'react';

// <Pricing/> displays the pricing plans for your app
// It's your Stripe config in config.js.stripe.plans[] that will be used to display the plans
// <ButtonCheckout /> renders a button that will redirect the user to Stripe checkout called the /api/stripe/create-checkout API endpoint with the correct priceId

const Pricing = ({ hide }: { hide: boolean }) => {
  const initialStage = hide ? false : true;

  const [toggle, setToggle] = useState<boolean>(initialStage);
  return (
    <section
      className=' overflow-hidden w-full'
      id='pricing'>
      <div
        className={
          hide ? 'p-4 max-w-5xl mx-auto' : 'py-24 px-8 max-w-5xl mx-auto'
        }>
        {!hide && (
          <div className='flex flex-col justify-between text-center items-center w-full  mb-20'>
            <p className='font-medium text-primary mb-8'>Pricing</p>
            <h2 className='font-bold text-3xl lg:text-5xl max-w-96 lg:max-w-xl tracking-tight'>
            One Plan to nail all of your life goals with AI
            </h2>
          </div>
        )}

        <div className='relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-6'>
          <div className='relative w-full max-w-lg'>
            {/* {plan.isFeatured && ( */}
            <div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20'>
              <span
                className={`badge text-xs py-5 sdm:py-1 text-primary-content font-semibold border-0 bg-green-500`}>
                ONE PLAN TO SECURE YOUR US F1 VISA
              </span>
            </div>
            {/* )} */}

            {/* {plan.isFeatured && ( */}
            <div
              className={`absolute -inset-[3px] rounded-[9px] bg-green-500 z-10`}></div>
            {/* )} */}

            <div className='relative flex flex-col border  h-full gap-5 lg:gap-8 z-10 bg-white p-8 rounded-lg'>
              <div className='flex justify-between items-center gap-4'>
                <div>
                  <p className='text-lg lg:text-xl font-extrabold'>
                    Success Plan (45% off)
                  </p>
                  <p className='text-base-content/60 text-xs mt-2'>
                    One Plan designed to build confidence and practice US F1
                    student visa interview. Try our AI mock interviews taken by
                    AI Visa Officer.
                  </p>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-col justify-end mb-[4px] text-lg '>
                  <p className='relative'>
                    {/* <span className='absolute bg-rose-600 h-[1.5px] inset-x-0 top-[53%]'></span> */}
                    <span className='text-base-content/80 line-through text-sm font-semibold text-red-500'>
                      $69.99 USD
                    </span>
                  </p>
                </div>
                <div className='flex gap-2'>
                  <p
                    className={`text-5xl tracking-tight text-green-600 font-extrabold`}>
                    $39.99
                  </p>

                  <div className='flex flex-col justify-end mb-[4px]'>
                    <p className='text-base text-base-content/60 uppercase text-green-600 font-semibold'>
                      USD
                    </p>
                    <p
                      className={`text-xs tracking-tight text-stone-500 font-extrabold`}>
                      OR (3,499 INR)
                    </p>
                  </div>
                </div>
              </div>

              {hide ? (
                <div
                  className='cursor-pointer text-xs mt-2 flex flex-col justify-center items-center gap-1'
                  onClick={() => setToggle(!toggle)}>
                  <hr className='w-full' />
                  <div className='relative text-center text-gray-600 border w-fit px-3 rounded-full bg-white -top-3'>
                    {!toggle ? 'show features' : 'hide features'}
                  </div>
                </div>
              ) : (
                <hr className='w-full' />
              )}

              {toggle && (
                <>
                  <div>
                    <p className='text-lg text-green-600 font-extrabold '>
                      What you are paying for!
                    </p>
                    <p className='text-base-content/60 text-xs mt-1 '>
                      Features designed to get your visa approved
                    </p>
                  </div>
                  <ul className='space-y-3.5 leading-relaxed text-base flex-1'>
                    <li className='flex items-center gap-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        className='w-[18px] h-[18px] opacity-80 shrink-0'>
                        <path
                          fillRule='evenodd'
                          d='M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z'
                          clipRule='evenodd'
                        />
                      </svg>

                      <span className='flex flex-col'>
                        <span>20 AI Mock Interviews</span>
                        <span className='text-[9px] text-base-content/60'>
                          20 Premium AI Visa Mock Interviews with AI Visa
                          officer
                        </span>
                      </span>
                    </li>

                    <li className='flex items-center gap-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        className='w-[18px] h-[18px] opacity-80 shrink-0'>
                        <path
                          fillRule='evenodd'
                          d='M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z'
                          clipRule='evenodd'
                        />
                      </svg>

                      <span className='flex flex-col'>
                        <span>Visa Approved/ Rejected</span>
                        <span className='text-[9px] text-base-content/60'>
                          Get realistic instant feedback from Our AI visa
                          officer - If your visa will be rejected or approved
                          based on your current mock interview within seconds.
                        </span>
                      </span>
                    </li>

                    <li className='flex items-center gap-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        className='w-[18px] h-[18px] opacity-80 shrink-0'>
                        <path
                          fillRule='evenodd'
                          d='M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z'
                          clipRule='evenodd'
                        />
                      </svg>

                      <span className='flex flex-col'>
                        <span>Premium HD Voices</span>
                        <span className='text-[9px] text-base-content/60'>
                          All Visa Mock Interviews will be conducted with
                          Premium US accent human like voices
                        </span>
                      </span>
                    </li>

                    <li className='flex items-center gap-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        className='w-[18px] h-[18px] opacity-80 shrink-0'>
                        <path
                          fillRule='evenodd'
                          d='M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z'
                          clipRule='evenodd'
                        />
                      </svg>

                      <span className='flex flex-col'>
                        <span>Interview QNA Guide PDF</span>
                        <span className='text-[9px] text-base-content/60'>
                          Most asked common question and answer guide for F1
                          visa interviews completely free (PDF)
                        </span>
                      </span>
                    </li>

                    <li className='flex items-center gap-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        className='w-[18px] h-[18px] opacity-80 shrink-0'>
                        <path
                          fillRule='evenodd'
                          d='M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z'
                          clipRule='evenodd'
                        />
                      </svg>

                      <span className='flex flex-col'>
                        <span>Additional +10 Interviews</span>
                        <span className='text-[9px] text-base-content/60'>
                          Failed in real US f1 visa, To practice more get +10
                          additional interviews for absolutely FREE
                        </span>
                      </span>
                    </li>

                    <li className='flex items-center gap-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        className='w-[18px] h-[18px] opacity-80 shrink-0'>
                        <path
                          fillRule='evenodd'
                          d='M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z'
                          clipRule='evenodd'
                        />
                      </svg>

                      <span className='flex flex-col'>
                        <span>Mobile App (coming soon)</span>
                        <span className='text-[9px] text-base-content/60'>
                          Practice US mock visa interview on the go with our
                          upcoming mobile app on both Android and IOS devices.
                        </span>
                      </span>
                    </li>

                    <li className='flex items-center gap-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        className='w-[18px] h-[18px] opacity-80 shrink-0'>
                        <path
                          fillRule='evenodd'
                          d='M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z'
                          clipRule='evenodd'
                        />
                      </svg>

                      <span className='flex flex-col'>
                        <span>Premium Support</span>
                        <span className='text-[9px] text-base-content/60'>
                          We work hard to solve all of your questions/doubt as
                          quickly as possible. Get in touch with us via email,
                          call and chat.
                        </span>
                      </span>
                    </li>
                  </ul>
                </>
              )}

              <div className='space-y-2 w-full'>
                <ButtonCheckout
                  variantId={config.lemonsqueezy.plans[0].variantId}
                />
                <p className='flex items-center justify-center gap-2 text-xs mt-3 text-center text-base-content/80 font-medium relative'>
                  Pay once. Access until you get your visa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
