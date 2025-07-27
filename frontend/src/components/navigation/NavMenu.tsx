import MenuItem from './MenuItem';

export default function NavMenu() {
  return (
    <div className='hidden md:flex items-center space-x-2'>
      <MenuItem href='/expenses'>Dépenses</MenuItem>
      <MenuItem href='/incomes'>Revenus</MenuItem>
      <MenuItem href='/forecasts'>Prévisions</MenuItem>
      <MenuItem href='/about'>À propos</MenuItem>
    </div>
  );
}
