import Link from 'next/link';
import { FC } from 'react';

interface Props {}

const Logo: FC<Props> = () => {
  return (
    <>
      <Link href={'/'} className="text-2xl font-semibold">
        <span>
          <span className="text-primary">L</span>ynkks
        </span>
      </Link>
    </>
  );
};

export default Logo;
