import { useEffect } from 'react';
import { useAlert } from '@/contexts/alerContext';

export default function Alert() {
  const { show, setShow, message } = useAlert();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [show, setShow]);

  return (
    <div
      role="alert"
      className={`max-w-150 flex w-full p-3 text-sm text-slate-600 rounded-md bg-slate-100 transition-all ease-in-out duration-700 absolute right-10 ${show ? 'bottom-10' : 'bottom-[-30px]'}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="h-5 w-5 mr-2">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path>
      </svg>
      <p>{message}</p>
      <button
        className="flex cursor-pointer items-center justify-center transition-all w-8 h-8 rounded-md text-white hover:bg-slate-200 active:bg-slate-200 absolute top-1.5 right-1.5"
        onClick={() => setShow(false)}
        type="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-5 w-5 text-slate-600"
          strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  );
}
