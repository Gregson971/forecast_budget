import { formatDistanceToNow } from 'date-fns';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

type Props = {
  session: any;
  isCurrent: boolean;
  onRevoke: () => void;
};

export default function SessionItem({ session, isCurrent, onRevoke }: Props) {
  return (
    <div className='flex justify-between items-center border-b py-2'>
      <div>
        <p className='font-semibold'>{session.user_agent}</p>
        <p className='text-sm text-gray-500'>
          IP : {session.ip_address} — {formatDistanceToNow(new Date(session.created_at))} ago
        </p>
        {isCurrent && <Badge variant='outline'>Appareil actuel</Badge>}
        {session.revoked && <Badge variant='destructive'>Révoquée</Badge>}
      </div>
      {!session.revoked && !isCurrent && (
        <Button variant='destructive' size='sm' onClick={onRevoke}>
          Se déconnecter
        </Button>
      )}
    </div>
  );
}
