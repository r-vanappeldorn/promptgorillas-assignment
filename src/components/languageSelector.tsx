import { Dispatch } from 'react';

const langauges = [
  {
    isoCode: 'nl',
    name: 'Nederlands',
  },
  {
    isoCode: 'en',
    name: 'Engels',
  },
  {
    isoCode: 'de',
    name: 'Duits',
  },
];

type Props = {
  setIsoCode: Dispatch<string>;
  defaultIsoCode: string;
};

export function LanguageSelector({ setIsoCode, defaultIsoCode }: Props) {
  return (
    <select onChange={e => setIsoCode(e.target.value)}>
      {langauges.map(item => (
        <option key={item.isoCode} value={item.isoCode}>
          {item.name}
        </option>
      ))}
    </select>
  );
}
