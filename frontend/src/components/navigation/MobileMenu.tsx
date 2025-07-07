import MenuItem from './MenuItem';

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  user?: { first_name: string; last_name: string };
  logout?: () => void;
};

export default function MobileMenu({ open, onClose, user, logout }: MobileMenuProps) {
  return (
    <div className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
      <aside
        className={`fixed top-0 left-0 glass bg-white/90 backdrop-blur-xl border-r border-white/10 w-[80vw] max-w-xs min-h-screen pt-8 p-6 shadow-lg transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className='mb-8 text-gray-400 hover:text-gray-700 text-2xl' onClick={onClose} aria-label='Fermer le menu'>
          ✕
        </button>
        {/* Utilisateur mobile */}
        <div className='mb-6'>
          {user ? (
            <div className='flex items-center space-x-2 mb-4'>
              <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                <span className='text-sm font-medium text-white'>
                  {user.first_name?.charAt(0)}
                  {user.last_name?.charAt(0)}
                </span>
              </div>
              <span className='text-gray-300 font-medium'>
                {user.first_name} {user.last_name}
              </span>
            </div>
          ) : null}
        </div>
        <nav className='flex flex-col space-y-2 mb-6'>
          <MenuItem href='/expenses' onClick={onClose}>
            Dépenses
          </MenuItem>
          <MenuItem href='/incomes' onClick={onClose}>
            Revenus
          </MenuItem>
          <MenuItem href='/budgets' onClick={onClose}>
            Budget
          </MenuItem>
          <MenuItem href='/about' onClick={onClose}>
            À propos
          </MenuItem>
        </nav>
        {/* Boutons connexion/déconnexion mobile */}
        {user ? (
          <button
            onClick={() => {
              logout && logout();
              onClose();
            }}
            className='w-full px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25'
          >
            Déconnexion
          </button>
        ) : (
          <div className='flex flex-col space-y-2'>
            <MenuItem href='/auth/login' onClick={onClose}>
              Connexion
            </MenuItem>
            <MenuItem href='/auth/register' onClick={onClose}>
              Inscription
            </MenuItem>
          </div>
        )}
      </aside>
    </div>
  );
}
