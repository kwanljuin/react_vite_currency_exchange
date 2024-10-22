const baseUrl = import.meta.env.VITE_BASE_URL;

export type ExchangeRateResponse = {
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
};

export type HistoricalRateResponse = {
  rates: { [date: string]: { [currency: string]: number } };
  start: string;
  end: string;
};

export const fetchRates = async (
  base: string,
  target: string
): Promise<ExchangeRateResponse> => {
  const response = await fetch(`${baseUrl}/latest?from=${base}&to=${target}`);
  if (!response.ok) {
    throw new Error("Failed to fetch exchange rate");
  }
  return response.json();
};

export const fetchHistoricalRates = async (
  base: string,
  target: string,
  start: string,
  end: string
): Promise<HistoricalRateResponse> => {
  const response = await fetch(
    `${baseUrl}/${start}..${end}?from=${base}&to=${target}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch historical rates");
  }
  return response.json();
};
