'use client';

import { createContext, FC, useContext, useState } from 'react';

const onBoardingSetupContext = createContext<any>(null);

interface PopulatedLinks {}

const OnboardingContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [step, setStep] = useState(3);
  //   const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  //   const [populatedLinks, setPopulatedLinks] = useState<>([]);

  return (
    <onBoardingSetupContext.Provider value={{ step, setStep }}>
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
