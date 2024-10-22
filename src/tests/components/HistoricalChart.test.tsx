import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import * as api from "../../services/api";
import HistoricalChart from "../../components/HistoricalChart";
import { CurrencyContext } from "../../context/CurrencyContext";
import { HistoricalRateResponse } from "../../services/api";

// Mock recharts components
vi.mock("recharts", () => ({
  LineChart: vi.fn(({ children }) => (
    <div data-testid="line-chart">{children}</div>
  )),
  Line: vi.fn(() => <div data-testid="line" />),
  XAxis: vi.fn(() => <div data-testid="x-axis" />),
  YAxis: vi.fn(() => <div data-testid="y-axis" />),
  CartesianGrid: vi.fn(() => <div data-testid="cartesian-grid" />),
  Tooltip: vi.fn(() => <div data-testid="tooltip" />),
  Legend: vi.fn(() => <div data-testid="legend" />),
}));

describe("HistoricalChart", () => {
  const mockContextValue = {
    baseCurrency: "MYR",
    targetCurrency: "JPY",
    setBaseCurrency: vi.fn(),
    setTargetCurrency: vi.fn(),
  };

  const mockHistoricalData = {
    start: "2024-10-20",
    end: "2024-10-21",
    rates: {
      "2024-10-20": { JPY: 34.5 },
      "2024-10-21": { JPY: 35.0 },
      "2024-10-22": { JPY: 34.0 },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(api, "fetchHistoricalRates").mockResolvedValue(mockHistoricalData);
  });

  const renderComponent = () => {
    return render(
      <CurrencyContext.Provider value={mockContextValue}>
        <HistoricalChart />
      </CurrencyContext.Provider>
    );
  };

  test("renders chart components", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
      expect(screen.getByTestId("line")).toBeInTheDocument();
      expect(screen.getByTestId("x-axis")).toBeInTheDocument();
      expect(screen.getByTestId("y-axis")).toBeInTheDocument();
      expect(screen.getByTestId("cartesian-grid")).toBeInTheDocument();
      expect(screen.getByTestId("tooltip")).toBeInTheDocument();
      expect(screen.getByTestId("legend")).toBeInTheDocument();
    });
  });

  test("fetches and displays historical data", async () => {
    renderComponent();

    await waitFor(() => {
      expect(api.fetchHistoricalRates).toHaveBeenCalledWith(
        "MYR",
        "JPY",
        expect.any(String),
        expect.any(String)
      );
    });

    // Check if the rate is displayed in the header
    const header = await screen.findByText("1 MYR = 34.00 JPY");
    expect(header).toBeInTheDocument();
  });

  test("updates when currency context changes", async () => {
    const { rerender } = renderComponent();

    // Update context with new currencies
    const newMockContextValue = {
      ...mockContextValue,
      baseCurrency: "USD",
      targetCurrency: "MYR",
    };

    // Mock new data for different currencies
    vi.spyOn(api, "fetchHistoricalRates").mockResolvedValue({
      start: "2024-10-20",
      end: "2024-10-21",
      rates: {
        "2024-10-20": { MYR: 4.56 },
        "2024-10-21": { MYR: 4.45 },
        "2024-10-22": { MYR: 4.32 },
      },
    } as HistoricalRateResponse);

    // Rerender with new context
    rerender(
      <CurrencyContext.Provider value={newMockContextValue}>
        <HistoricalChart />
      </CurrencyContext.Provider>
    );

    // Check if the rate updated
    const updatedHeader = await screen.findByText("1 USD = 4.32 MYR");
    expect(updatedHeader).toBeInTheDocument();
  });
});
