import React, { useEffect, useState, useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchHistoricalRates } from "../services/api";
import { CurrencyContext } from "../context/CurrencyContext";

type HistoricalData = {
  date: string;
  rate: number;
};

const HistoricalChart: React.FC = () => {
  const { baseCurrency, targetCurrency } = useContext(CurrencyContext)!;
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const rate =
    historicalData.length > 0
      ? historicalData[historicalData.length - 1]?.rate?.toFixed(2)
      : null;

  useEffect(() => {
    const fetchHistoricalData = async () => {
      const current = new Date();
      //   current.setFullYear(current.getFullYear() - 1);
      current.setMonth(current.getMonth() - 1);
      const start = current.toISOString().slice(0, 10);
      const end = new Date().toISOString().slice(0, 10);
      const data = await fetchHistoricalRates(
        baseCurrency,
        targetCurrency,
        start,
        end
      );
      //  API Response:
      //  "rates": "2023-10-23": {
      //     "MYR": 4.785
      //  },
      const formattedData = Object.entries(data.rates).map(
        ([date, rateObj]) => ({
          date,
          rate: rateObj[targetCurrency],
        })
      );
      setHistoricalData(formattedData);
    };
    fetchHistoricalData();
  }, [baseCurrency, targetCurrency]);

  return (
    <div className="px-2 py-4 bg-white rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-4">
        {rate && `1 ${baseCurrency} = ${rate} ${targetCurrency}`}
      </h2>
      <ResponsiveContainer width="95%" height={400}>
        <LineChart width={600} height={200} data={historicalData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="rate"
            name={`${baseCurrency} to ${targetCurrency}`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalChart;
