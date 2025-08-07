/** @format */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Suspense } from 'react';

// Force dynamic rendering to prevent prerendering issues
export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { BreadcrumbNav } from '@/components/breadcrumb-nav';
import { getAbsoluteUrl } from '@/lib/utils';
import toast from 'react-hot-toast';
import config from '@/config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

function LoginPageContent() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Ref for OTP input
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Focus OTP input when showOtpInput becomes true
  useEffect(() => {
    if (showOtpInput && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [showOtpInput]);

  
    // Auto-focus phone input when component mounts (only once)
  useEffect(() => {
    const phoneInput = document.querySelector('.react-tel-input input') as HTMLInputElement;
    if (phoneInput) {
      phoneInput.focus();
      // Position cursor after the country code (+1)
      setTimeout(() => {
        phoneInput.setSelectionRange(2, 2); // Position after "+1"
      }, 0);
    }
  }, []); // Empty dependency array - only runs once on mount



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
      const redirectTo = searchParams.get('redirectedFrom') || '/dash';
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header user={null} router={router} />
      <main className='p-4 mb-40 flex flex-col items-center justify-center h-[calc(100vh-100px)] max-w-7xl mx-auto'>
     

        <Card className='max-w-md mx-auto'>
          <CardHeader>
            <CardTitle className='text-3xl md:text-4xl font-extrabold tracking-tight text-center'>
              Login with Phone
            </CardTitle>
            <CardDescription>
              Sign in with your number to manage your goals
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-8'>
            {error && (
              <Alert
                variant='destructive'
                className='mb-4'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className='space-y-4'>
              {!showOtpInput ? (
                <>
                  <div className='space-y-2'>
                    <Label htmlFor='phone'>Phone Number</Label>
                    <PhoneInput
                      country={'us'}
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                      enableSearch={true}
                      searchPlaceholder="Search country..."
                      searchNotFound="No country found"
                      inputStyle={{
                        fontFamily: '"Bricolage Grotesque", sans-serif',
                        fontWeight: '500',
                        boxShadow:
                          '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                        padding: '12px 14px 12px 60px',
                        color: '#0D0A09',
                        width: '100%',
                        border: '1px solid #E7E5E4',
                        borderRadius: '6px',
                        fontSize: '14px',
                        lineHeight: '19px',
                        transition: 'border-color 0.2s ease-in-out',
                        background: 'transparent',
                      }}
                      buttonStyle={{
                        border: '0px solid #E7E5E4',
                        borderRight: 'none',
                        borderRadius: '6px 0 0 6px',
                        backgroundColor: 'transparent',
                        fontFamily: '"Bricolage Grotesque", sans-serif',
                        fontWeight: '500',
                      }}
                      dropdownStyle={{
                        fontFamily: '"Bricolage Grotesque", sans-serif',
                        fontWeight: '500',
                        maxHeight: '200px',
                        overflowY: 'auto',
                      }}
                      searchStyle={{
                        fontFamily: '"Bricolage Grotesque", sans-serif',
                        fontWeight: '500',
                        padding: '8px 12px',
                        border: '1px solid #E7E5E4',
                        borderRadius: '4px',
                        fontSize: '14px',
                        width: '100%',
                        marginBottom: '8px',
                      }}
                      containerStyle={{
                        width: '100%',
                        fontFamily: '"Bricolage Grotesque", sans-serif',
                        fontWeight: '500',
                      }}
                      inputProps={{
                        required: true,
                        onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
                          e.target.style.border = '1px solid #000000';
                          e.target.style.boxShadow = 'none';
                        },
                        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                          e.target.style.border = '1px solid #E7E5E4';
                        },
                        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === 'Enter' && phoneNumber && !loading) {
                            handleSendOtp();
                          }
                        },
                      }}
                    />
                  </div>
                  <Button
                    className='w-full h-10'
                    onClick={handleSendOtp}
                    disabled={loading || !phoneNumber}>
                    {loading ? 'Sending...' : 'Send OTP'}
                  </Button>
                </>
              ) : (
                <>
                  <div className='space-y-2'>
                    <Label htmlFor='otp'>Enter OTP</Label>
                    <Input
                      id='otp'
                      className='h-10'
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
                    />
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      className='flex-1 py-5'
                      onClick={() => setShowOtpInput(false)}
                      disabled={loading}>
                      Back
                    </Button>
                    <Button
                      className='flex-1 py-5'
                      onClick={handleVerifyOtp}
                      disabled={loading || !otp}>
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
