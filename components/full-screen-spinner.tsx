import { Loader2 } from 'lucide-react';
import { FC } from 'react';

interface Props {}

const FullScreenSpinner: FC<Props> = () => {
  return (
    <>
      <div className="fixed inset-0 w-screen h-screen z-[100] bg-[#D9D9D9] bg-opacity-70 backdrop-blur-sm flex items-center justify-center">
        <Loader2 className="text-primary w-14 h-14 animate-spin" />
      </div>
    </>
  );
};

export default FullScreenSpinner;
