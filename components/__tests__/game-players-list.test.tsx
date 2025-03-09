import { render, screen } from "@testing-library/react";
import GamePlayersList from "../game-players-list";
import { Player } from "../../domain/game/game";
import { useRouter } from "next/navigation";
import { useSupabase } from "../supabase-provider";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    refresh: jest.fn(),
  })),
}));

// Mock Supabase provider
jest.mock("../supabase-provider", () => ({
  useSupabase: jest.fn(() => ({
    session: null,
  })),
}));

// Mock the Supabase client
jest.mock("../../utils/supabase-browser", () => ({
  createBrowserClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    delete: jest.fn().mockResolvedValue({ error: null }),
  })),
}));

const mockPlayers = {
  mainSquad: [
    {
      id: "1",
      name: "John Doe",
      role: "GK",
      gameId: "game1",
      skill: "3",
      shape: "3",
      team: 1,
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "DF",
      gameId: "game1",
      skill: "4",
      shape: "4",
      team: 2,
    },
  ] as Player[],
  bench: [
    {
      id: "3",
      name: "Bob Wilson",
      role: "MF",
      gameId: "game1",
      skill: "3",
      shape: "3",
    },
  ] as Player[],
};

describe("GamePlayersList", () => {
  it("renders players correctly", () => {
    render(
      <GamePlayersList
        splitedPlayers={mockPlayers}
        gameCreator="creator-id"
        gameName="Test Game"
        canAnonRemove={false}
        ignoreLocalStorage={false}
        isGamePublic={true}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Wilson")).toBeInTheDocument();
  });

  it("displays main squad and bench sections", () => {
    render(
      <GamePlayersList
        splitedPlayers={mockPlayers}
        gameCreator="creator-id"
        gameName="Test Game"
        canAnonRemove={false}
        ignoreLocalStorage={false}
        isGamePublic={true}
      />
    );

    expect(screen.getByText("Grają:")).toBeInTheDocument();
    expect(screen.getByText("Rezerwa:")).toBeInTheDocument();
  });

  it("shows remove buttons for players", () => {
    render(
      <GamePlayersList
        splitedPlayers={mockPlayers}
        gameCreator="creator-id"
        gameName="Test Game"
        canAnonRemove={true}
        ignoreLocalStorage={false}
        isGamePublic={true}
      />
    );

    const removeButtons = screen.getAllByText("Usuń");
    expect(removeButtons).toHaveLength(3); // One for each player
  });

  it("handles anonymous removal setting", () => {
    render(
      <GamePlayersList
        splitedPlayers={mockPlayers}
        gameCreator="creator-id"
        gameName="Test Game"
        canAnonRemove={false}
        ignoreLocalStorage={false}
        isGamePublic={false}
      />
    );

    const removeButtons = screen.getAllByText("Usuń");
    expect(removeButtons).toHaveLength(3);
  });
});