import { fireEvent, render, screen } from "@testing-library/react";
import { usePathname, useRouter } from "next/navigation";
import { Game, Player } from "../../domain/game/game";
import GameStatsPanel from "../game-stats-panel";
import { useSupabase } from "../supabase-provider";

// Mock the hooks
jest.mock("../supabase-provider", () => ({
  useSupabase: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("@/utils/supabase-browser", () => ({
  createBrowserClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
  })),
}));

describe("GameStatsPanel", () => {
  const mockGame: Game = {
    id: "1",
    name: "Test Game",
    numberOfPlayers: 10,
    customTeams: false,
    description: "Test description",
    date: "2024-03-20",
    price: 30,
    place: "Test place",
    time: "20:30",
    creatorContact: "test@example.com",
  };

  const mockPlayers: Player[] = [];
  const mockUserData = null;
  const mockSuggestedSquads: Player[][] = [[], []];
  const mockInputAIPlayers: Player[] = [];

  beforeEach(() => {
    (useSupabase as jest.Mock).mockReturnValue({
      session: { user: { id: "123" } },
    });
    (useRouter as jest.Mock).mockReturnValue({
      refresh: jest.fn(),
      push: jest.fn(),
    });
    (usePathname as jest.Mock).mockReturnValue("/game/1");
  });

  it("should close AI squad modal when OK button is clicked", async () => {
    render(
      <GameStatsPanel
        game={mockGame}
        players={mockPlayers}
        userData={mockUserData}
        suggestedSquds={mockSuggestedSquads}
        inputAIPlayers={mockInputAIPlayers}
      />
    );

    // Open the AI squad modal
    const openButton = screen.getByText("Składy");
    fireEvent.click(openButton);

    // Verify modal is open
    expect(screen.getByText("Sugerowane składy")).toBeInTheDocument();
    expect(screen.getByText("FC Ziomale")).toBeInTheDocument();
    expect(screen.getByText("Mordeczki United")).toBeInTheDocument();

    // Click OK button
    const okButton = screen.getByText("Ok");
    fireEvent.click(okButton);

    // Verify modal is closed
    expect(screen.queryByText("Sugerowane składy")).not.toBeInTheDocument();
  });
});
