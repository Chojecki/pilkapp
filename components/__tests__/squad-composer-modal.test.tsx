import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { act } from "react-dom/test-utils";
import { createBrowserClient } from "../../utils/supabase-browser";
import SquadComposerModal from "../squad-composer-modal";

// Mock the dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../utils/supabase-browser", () => ({
  createBrowserClient: jest.fn(),
}));

jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: [
      { id: "1", name: "Player 1", team: 1 },
      { id: "2", name: "Player 2", team: 2 },
    ],
    mutate: jest.fn(),
  })),
}));

describe("SquadComposerModal", () => {
  const mockRouter = {
    refresh: jest.fn(),
  };

  const mockUpdate = jest.fn().mockReturnValue({
    eq: jest.fn().mockResolvedValue({ data: null, error: null }),
  });

  const mockSupabase = {
    from: jest.fn().mockReturnValue({
      update: mockUpdate,
    }),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (createBrowserClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should open modal when button is clicked", async () => {
    render(
      <SquadComposerModal
        gameId="test-game"
        isGameCustomTeams={false}
        numberOfPlayers={10}
      />
    );

    const button = screen.getByText("Ustaw składy");
    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByText("Ustawienia składów")).toBeInTheDocument();
  });

  it("should save changes when clicking save button", async () => {
    render(
      <SquadComposerModal
        gameId="test-game"
        isGameCustomTeams={false}
        numberOfPlayers={10}
      />
    );

    // Open modal
    const openButton = screen.getByText("Ustaw składy");
    await act(async () => {
      fireEvent.click(openButton);
    });

    // Toggle custom teams switch
    const switchInput = screen.getByRole("switch");
    await act(async () => {
      fireEvent.click(switchInput);
    });

    // Click save
    const saveButton = screen.getByText("Zapisz");
    await act(async () => {
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      // Verify Supabase update was called
      expect(mockSupabase.from).toHaveBeenCalledWith("games");
      expect(mockUpdate).toHaveBeenCalledWith({ customTeams: true });
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  it("should show loading state while saving", async () => {
    // Mock a delay in the Supabase update
    mockUpdate.mockImplementationOnce(() => ({
      eq: () => new Promise((resolve) => setTimeout(resolve, 100)),
    }));

    render(
      <SquadComposerModal
        gameId="test-game"
        isGameCustomTeams={false}
        numberOfPlayers={10}
      />
    );

    // Open modal
    const openButton = screen.getByText("Ustaw składy");
    await act(async () => {
      fireEvent.click(openButton);
    });

    // Click save
    const saveButton = screen.getByText("Zapisz");
    await act(async () => {
      fireEvent.click(saveButton);
    });

    // The button should show loading state
    expect(saveButton).toHaveTextContent("Zapisuje ...");

    await waitFor(() => {
      expect(saveButton).toHaveTextContent("Zapisz");
    });
  });
});
