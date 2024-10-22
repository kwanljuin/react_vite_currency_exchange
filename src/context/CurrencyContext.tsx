import React, { createContext, useState, ReactNode } from "react";

interface CurrencyContextType {
  baseCurrency: string;
  targetCurrency: string;
  setBaseCurrency: (currency: string) => void;
  setTargetCurrency: (currency: string) => void;
}

// Create context with an empty default value
export const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [baseCurrency, setBaseCurrency] = useState<string>("USD");
  const [targetCurrency, setTargetCurrency] = useState<string>("MYR");

  return (
    <CurrencyContext.Provider
      value={{
        baseCurrency,
        targetCurrency,
        setBaseCurrency,
        setTargetCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
