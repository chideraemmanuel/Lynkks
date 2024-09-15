'use client';

import { Link } from '@/constants';
import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react';

const onBoardingSetupContext = createContext<{
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  selectedLinks: Link[];
  setSelectedLinks: Dispatch<SetStateAction<Link[]>>;
  populatedLinks: PopulatedLinks[];
  setPopulatedLinks: Dispatch<SetStateAction<PopulatedLinks[]>>;
} | null>(null);

type PopulatedLinks = Pick<Link, 'name'> & {
  href: string;
};

const OnboardingContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [step, setStep] = useState(1);
  const [selectedLinks, setSelectedLinks] = useState<Link[]>([]);
  const [populatedLinks, setPopulatedLinks] = useState<PopulatedLinks[]>([]);

  return (
    <onBoardingSetupContext.Provider
      value={{
        step,
        setStep,
        selectedLinks,
        setSelectedLinks,
        populatedLinks,
        setPopulatedLinks,
      }}
    >
      {children}
    </onBoardingSetupContext.Provider>
  );
};

const useOnBoardingSetupContext = () => {
  const context = useContext(onBoardingSetupContext);

  if (!context) {
    throw Error(
      '"useOnBoardingSetupContext" must be used within "OnboardingContextProvider"'
    );
  }

  return context;
};

export { useOnBoardingSetupContext };

export default OnboardingContextProvider;
