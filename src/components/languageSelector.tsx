import { Dispatch } from 'react';
import { useState, useRef, useEffect } from 'react';

type Props = {
  setIsoCode: Dispatch<string>;
  selectedIsoCode: string;
};

type Language = {
  isoCode: string;
  name: string;
  icon: string;
};

const people: Language[] = [
  {
    isoCode: 'nl',
    name: 'Dutch',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Flag_of_the_Netherlands.svg/1280px-Flag_of_the_Netherlands.svg.png',
  },
  {
    isoCode: 'en',
    name: 'English',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1920px-Flag_of_the_United_Kingdom_%281-2%29.svg.png',
  },
  {
    isoCode: 'se',
    name: 'Spanish',
    icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Flag_of_Spain.svg/1280px-Flag_of_Spain.svg.png',
  },
  {
    isoCode: 'de',
    name: 'German',
    icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Flag_of_Germany.svg/1920px-Flag_of_Germany.svg.png',
  },
  {
    isoCode: 'fr',
    name: 'French',
    icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/1280px-Flag_of_France.svg.png',
  },
];

export default function LanguageSelector({
  setIsoCode,
  selectedIsoCode,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const listboxRef = useRef<HTMLUListElement | null>(null);

  const selectedPerson = people.find(p => p.isoCode === selectedIsoCode)!;

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleSelect = (isoCode: string) => {
    setIsoCode(isoCode);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen && listboxRef.current) {
      const selectedEl = listboxRef.current.querySelector(
        `[data-id='${selectedIsoCode}']`,
      );
      (selectedEl as HTMLElement)?.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, selectedIsoCode]);

  return (
    <div className="w-100">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Language
      </label>
      <div className="relative cursor-pointer">
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between border border-gray-300 bg-white rounded-md px-3 py-2 text-left text-sm focus:outline-none">
          <div className="flex items-center gap-2">
            <img
              src={selectedPerson.icon}
              alt=""
              className="h-6 w-6 rounded-full"
            />
            <span>{selectedPerson.name}</span>
          </div>
          <svg
            className="h-5 w-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z" />
            <path d="M6.293 12.707a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
          </svg>
        </button>
        {isOpen && (
          <ul
            ref={listboxRef}
            className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm max-h-60 overflow-auto text-sm">
            {people.map(person => (
              <li
                key={person.isoCode}
                data-id={person.isoCode}
                onClick={() => handleSelect(person.isoCode)}
                className={`cursor-pointer select-none relative py-2 pl-4 pr-10 flex items-center gap-2 ${
                  person.isoCode === selectedIsoCode
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-900'
                }`}>
                <img
                  src={person.icon}
                  alt=""
                  className="h-6 w-6 rounded-full"
                />
                <span
                  className={`block truncate ${person.isoCode === selectedIsoCode ? 'font-semibold' : 'font-normal'}`}>
                  {person.name}
                </span>
                {person.isoCode === selectedIsoCode && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
