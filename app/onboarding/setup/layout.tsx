import Logo from '@/components/logo';
import OnboardingContextProvider from '@/contexts/onboarding-setup-context';
import { FC } from 'react';

interface Props {
  children: React.ReactNode;
}

const OnboardingSetupLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <OnboardingContextProvider>
        <div className="bg-white">
          <div className="px-4 md:container mx-auto relative flex items-center justify-center min-h-screen">
            <div className="absolute top-8 left-4 md:left-8">
              <Logo />
            </div>

            {/* <div className="w-[min(570px,_100%)] py-28">{children}</div> */}
            <div className="w-[min(800px,_100%)] py-28">{children}</div>
          </div>
        </div>
      </OnboardingContextProvider>
    </>
  );
};

export default OnboardingSetupLayout;
