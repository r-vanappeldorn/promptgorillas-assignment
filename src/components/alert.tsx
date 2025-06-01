import { useEffect } from 'react';
import { useAlert } from '@/contexts/alerContext';

export default function Alert() {
  const { show, setShow, title, message } = useAlert();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [show, setShow]);

  return (
    <div role="alert" className={`absolute transition-all duration-500 right-10 ease-in-out ${ show ? 'bottom-10 opacity-100' : 'bottom-[-90px] opacity-0'}`}>
      <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
        {title}
      </div>
      <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
        <p>{message}</p>
      </div>
    </div>
  );
}
