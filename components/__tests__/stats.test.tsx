import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import Stats from "../stats";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("Stats", () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/game/1");
  });

  it("should display player count in red when below minimum players", () => {
    render(
      <Stats
        playrsLength={13}
        numberOfPlayers={14}
        name="Test Game"
        description="Test Description"
        price={30}
        place="Test Place"
        date="2024-03-20"
        time="20:30"
        creatorContact="test@example.com"
        canManage={false}
        canAnonRemove={false}
        onAnonRemoveFlagChange={() => {}}
      />
    );

    const playerCount = screen.getByTestId("players-count");
    expect(playerCount).toHaveClass("text-red-500");
    expect(playerCount).toHaveTextContent("13");
  });

  it("should display player count in normal color when matching minimum players", () => {
    render(
      <Stats
        playrsLength={14}
        numberOfPlayers={14}
        name="Test Game"
        description="Test Description"
        price={30}
        place="Test Place"
        date="2024-03-20"
        time="20:30"
        creatorContact="test@example.com"
        canManage={false}
        canAnonRemove={false}
        onAnonRemoveFlagChange={() => {}}
      />
    );

    const playerCount = screen.getByTestId("players-count");
    expect(playerCount).not.toHaveClass("text-red-500");
    expect(playerCount).toHaveTextContent("14");
  });
});
