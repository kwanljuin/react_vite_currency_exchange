import CurrencyConverter from "./components/CurrencyConverter";
import HistoricalChart from "./components/HistoricalChart";
import { CurrencyProvider } from "./context/CurrencyContext";
import Carousel from "./components/ImageCarousel";
import "./App.css";

function App() {
  const images = [
    "https://picsum.photos/1280/300?random=1",
    "https://picsum.photos/1280/300?random=2",
    "https://picsum.photos/1280/300?random=3",
    "https://picsum.photos/1280/300?random=4",
    "https://picsum.photos/1280/300?random=5",
  ];

  return (
    <CurrencyProvider>
      <div className="App">
        <div className="px-4 md:px-8 py-6 bg-gray-50 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4">Currency Converter</h1>
          <CurrencyConverter />
          <HistoricalChart />
        </div>
      </div>
      <Carousel images={images} />
    </CurrencyProvider>
  );
}

export default App;
