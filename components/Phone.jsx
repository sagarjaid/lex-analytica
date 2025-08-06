'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import './phone-input-custom.css';
import { Sparkle } from 'lucide-react';

const Phone = ({ className = '', ...props }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInputActive, setIsInputActive] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Ref for OTP input
  const otpInputRef = useRef(null);

  // Focus OTP input when showOtpInput becomes true
  useEffect(() => {
    if (showOtpInput && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [showOtpInput]);

  // Auto-focus phone input when component mounts (only once)
  useEffect(() => {
    const phoneInput = document.querySelector('.react-tel-input input');
    if (phoneInput) {
      phoneInput.focus();
      // Position cursor after the country code (+1)
      setTimeout(() => {
        phoneInput.setSelectionRange(2, 2); // Position after "+1"
      }, 0);
    }
  }, []); // Empty dependency array - only runs once on mount

  // Update input active state based on phone number content
  useEffect(() => {
    setIsInputActive(phoneNumber.length > 0);
  }, [phoneNumber]);

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setError(null);

      // Format phone number to E.164 format
      const formattedPhone = `+${phoneNumber}`;

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      setShowOtpInput(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setError(null);

      // Format phone number to E.164 format
      const formattedPhone = `+${phoneNumber}`;

      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      // Redirect to the original destination or dashboard
      const redirectTo = searchParams.get('redirectedFrom') || '/dash/goals';
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`relative bg-[url('/blue-2.png')] bg-cover bg-center bg-no-repeat ${className}`} 
      style={{ minHeight: '720px', minWidth: '350px' }}
      {...props}
    >
      <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center p-6">
        {/* Star Icon */}
        
        <Sparkle        
                strokeWidth={1}
                color="Green"
                fill="Green"
                className="w-20 h-20 animate-pulse"
              />

        
        {/* Headline */}
        <h2 className="text-xl font-bold text-black text-center mb-6">
          Try Gym Reminder <br/>AI for FREE!
        </h2>

        <div className='flex flex-col gap-2 w-full p-2'>
        
        {/* Phone Input */}
        <div className="w-full max-w-sm">
          {!showOtpInput ? (
            <div className={`gradient-border ${isInputActive ? 'gradient-border-static' : ''}`}>
              <div className="input-content">
                <PhoneInput
                  country={'us'}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  enableSearch={true}
                  inputStyle={{
                    fontFamily: '"Bricolage Grotesque", sans-serif',
                    fontWeight: '500',
                    padding: '12px 14px 12px 60px',
                    color: '#0D0A09',
                    width: '100%',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    lineHeight: '19px',
                    background: 'transparent',
                    outline: 'none',
                  }}
                  buttonStyle={{
                    border: 'none',
                    borderRight: 'none',
                    borderRadius: '6px 0 0 6px',
                    backgroundColor: 'transparent',
                    fontFamily: '"Bricolage Grotesque", sans-serif',
                    fontWeight: '500',
                  }}
                  dropdownStyle={{
                    fontFamily: '"Bricolage Grotesque", sans-serif',
                    fontWeight: '500',
                  }}
                  containerStyle={{
                    width: '100%',
                    fontFamily: '"Bricolage Grotesque", sans-serif',
                    fontWeight: '500',
                  }}
                  inputProps={{
                    required: true,
                    onKeyDown: (e) => {
                      if (e.key === 'Enter' && phoneNumber && !loading) {
                        handleSendOtp();
                      }
                    },
                  }}
                />
              </div>
            </div>
          ) : (
            <div className={`gradient-border ${otp.length > 0 ? 'gradient-border-static' : ''}`}>
              <div className="input-content">
                <Input
                  type='text'
                  placeholder='Enter the code sent to your phone'
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && otp && !loading) {
                      handleVerifyOtp();
                    }
                  }}
                  ref={otpInputRef}
                  className="w-full p-6 rounded-lg border-none bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
        
       
        
        {/* Action Button */}
        <div className="w-full max-w-sm ">
          {!showOtpInput ? (
            <Button 
              onClick={handleSendOtp}
              disabled={loading || !phoneNumber}
              className="w-full bg-black text-white hover:bg-gray-800 py-6 rounded-lg font-medium disabled:opacity-80"
            >
              {loading ? 'Sending...' : 'Call Me Now'}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant='outline'
                className='flex-1'
                onClick={() => setShowOtpInput(false)}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                className='flex-1 bg-black text-white hover:bg-gray-800'
                onClick={handleVerifyOtp}
                disabled={loading || !otp}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>
          )}
        </div>

         {/* Error Message */}
         {error && (
          <div className="w-full max-w-xs mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        </div>

        <div className='flex flex-col gap-2 mt-6'>

        <a href='/'>
                <img
                  src="https://nevermissai.com/usedby.png"
                  className='w-[190px]'
                />
              </a>
              <p className='text-center text-xs'>
                289+ goals reminded today
              </p>
            
        </div>
        
        
              
          

      </div>


    </div>
  );
};

export default Phone;
