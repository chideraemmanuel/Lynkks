import Link from 'next/link';
import { FC } from 'react';

interface Props {}

const Logo: FC<Props> = () => {
  return (
    <>
      <Link href={'/'} className="text-2xl font-semibold">
        <span>
          Link<span className="text-primary">N</span>est
        </span>
      </Link>
    </>
  );
};

export default Logo;
