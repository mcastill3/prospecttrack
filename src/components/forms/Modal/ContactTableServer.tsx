// /components/forms/Modal/ContactTableServer.tsx
import { getContacts } from '@/app/actions/getContacts';
import ContactTableForm from './ContacTableForm';

const getFlagImageUrl = (countryName: string) => {
  // Por ejemplo, usando el código de país ISO 3166-1 alpha-2 si lo tienes
  const countryCode = countryName.toLowerCase();
  return `https://flagcdn.com/w40/${countryCode}.png`; // Ajusta según tu fuente de banderas
};


export default async function ContactTableServer() {
  const contacts = await getContacts();

  return <ContactTableForm contacts={contacts} getFlagImageUrl={getFlagImageUrl} selectedContactIds={[]} onSelectContact={function (ids: string[]): void {
    throw new Error('Function not implemented.');
  } }/>;
}