import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import * as api from "../../services/api";
import CurrencyConverter from "../../components/CurrencyConverter";
import { CurrencyContext } from "../../context/CurrencyContext";
import { ExchangeRateResponse } from "../../services/api";

describe("CurrencyConverter", () => {
  const mockContextValue = {
    baseCurrency: "USD",
    targetCurrency: "MYR",
    setBaseCurrency: vi.fn(),
    setTargetCurrency: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the fetchRates function
    vi.spyOn(api, "fetchRates").mockResolvedValue({
      base: "USD",
      date: "2024-10-22",
      rates: {
        MYR: 4.35,
      },
    } as ExchangeRateResponse);
  });

  const renderComponent = () => {
    return render(
      <CurrencyContext.Provider value={mockContextValue}>
        <CurrencyConverter />
      </CurrencyContext.Provider>
    );
  };

  test("fetches and displays exchange rate on mount", async () => {
    renderComponent();

    await waitFor(() => {
      expect(api.fetchRates).toHaveBeenCalledWith("USD", "MYR");
    });

    const targetAmount = screen.getByText("4.35");
    expect(targetAmount).toBeInTheDocument();
  });
});
