import React, { useEffect, useState, useContext } from "react";
import { fetchRates } from "../services/api";
import { CurrencyContext } from "../context/CurrencyContext";
import { currencies } from "../constants/currencies";

const CurrencyConverter: React.FC = () => {
  const { baseCurrency, targetCurrency, setBaseCurrency, setTargetCurrency } =
    useContext(CurrencyContext)!;
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [baseAmount, setBaseAmount] = useState<number>(1);
  const [targetAmount, setTargetAmount] = useState<number>(1);

  useEffect(() => {
    const getRates = async () => {
      const data = await fetchRates(baseCurrency, targetCurrency);
      setExchangeRate(data.rates[targetCurrency]);
    };
    getRates();
  }, [baseCurrency, targetCurrency]);

  useEffect(() => {
    if (exchangeRate) {
      const calculateTargetAmount = () => {
        const convertedAmount = (baseAmount * exchangeRate).toFixed(2);
        setTargetAmount(parseFloat(convertedAmount));
      };
      calculateTargetAmount();
    }
  }, [exchangeRate, baseAmount]);

  const handleSwitch = () => {
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
  };

  return (
    <div className="flex items-center flex-col md:flex-row">
      <div className="p-2 bg-white rounded-lg shadow-md w-full flex justify-between items-center ">
        <select
          className="p-2"
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <input
          className="p-2 ml-6 w-full text-right border rounded-lg"
          type="number"
          value={baseAmount}
          onChange={(e) => setBaseAmount(parseFloat(e.target.value))}
        />
      </div>

      <button
        className="m-4 px-4 py-4 border-none bg-blue-500 hover:bg-blue-400 text-white shadow-md rounded-lg w-full md:w-80"
        onClick={handleSwitch}
      >
        🔄 Switch
      </button>

      <div className="p-2 bg-white rounded-lg shadow-md w-full flex justify-between items-center">
        <select
          className="p-2"
          value={targetCurrency}
          onChange={(e) => setTargetCurrency(e.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <span className="py-2 px-6 ml-6  w-full text-right">
          {targetAmount}
        </span>
      </div>
    </div>
  );
};

export default CurrencyConverter;
