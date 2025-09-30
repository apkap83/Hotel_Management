import { getProviders, getCsrfToken } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
// import { options } from '@b2b-tickets/auth-options';

import { nice_hotel_splash as imagePath } from '@hotel_manage/assets';
import SignInForm from './components/SigninForm';
import Image from 'next/image';

export default async function SignIn({ searchParams }: { searchParams: any }) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken();

  // Check if user is already authenticated
  //   const session = await getServerSession(options);

  // Get the callback URL from search parameters
  //   const callbackUrl = searchParams?.callbackUrl || '/tickets';

  return (
    <>
      <h1>Sign in Page</h1>
      <Image
        src={imagePath}
        alt="Login Page Background Image"
        fill
        // className="blur-sm"
        style={{ objectFit: 'cover' }}
      />
      <SignInForm csrfToken={csrfToken} />
    </>
  );
}
