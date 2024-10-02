import { redirect } from 'next/navigation';
import { FC } from 'react';

interface Props {}

const NotFoundPage: FC<Props> = () => {
  return redirect('/');
};

export default NotFoundPage;
