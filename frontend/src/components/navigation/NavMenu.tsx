import MenuItem from './MenuItem';

export default function NavMenu() {
  return (
    <div className='hidden md:flex items-center space-x-2'>
      <MenuItem href='/transactions'>Transactions</MenuItem>
      <MenuItem href='/forecasts'>Prévisions</MenuItem>
      <MenuItem href='/about'>À propos</MenuItem>
    </div>
  );
}
