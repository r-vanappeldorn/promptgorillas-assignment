'use client';

import Link from 'next/link';

export function Login() {
  const handleLogin = () => {
    if (
      typeof process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === 'undefined' ||
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === ''
    ) {
      throw Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
    }

    if (
      typeof process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI === 'undefined' ||
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI === ''
    ) {
      throw Error('NEXT_PUBLIC_GOOGLE_REDIRECT_URI is not set');
    }

    const scope = encodeURIComponent('https://www.googleapis.com/auth/drive');

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&` +
      `response_type=code&` +
      `scope=${scope}&` +
      `access_type=offline&` +
      `prompt=consent`;

    window.location.href = authUrl;
  };

  return (
    <main className="h-dvh w-[100%] flex justify-center items-center flex-col">
      <div className="flex w-100 h-60 shadow-2xl items-center flex-col border border-gray-200">
        <h1 className="pt-10 text-xl font-medium text-gray-700">
          Login with google
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          We need access to google docs
        </p>
        <div className="flex justify-between items-center h-100 flex-col mt-6">
          <button
            onClick={handleLogin}
            type="button"
            className="cursor-pointer text-white bg-indigo-500 hover:bg-indigo-600 font-medium rounded-s text-sm px-5 py-2.5 text-center inline-flex items-center me-2 h-10 w-50 justify-center transition-all ease-in-out duration-300">
            <svg
              className="w-4 h-4 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 19">
              <path
                fillRule="evenodd"
                d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                clipRule="evenodd"
              />
            </svg>
            Sign in with Google
          </button>
          <span className="text-sm text-gray-500 mb-10">
            Don't have a google account?
            <Link
              className="text-sm text-indigo-500 hover:underline"
              href="https://docs.google.com/document/u/0/?usp=direct_url">
              {' '}
              create a account
            </Link>
          </span>
        </div>
      </div>
    </main>
  );
}
