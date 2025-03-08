import { Game, Player } from "../../domain/game/game";
import { splitTeams, suggestSquads } from "../squads";

describe("Squad Matching", () => {
  const createPlayer = (
    id: string,
    role: "GK" | "DF" | "MF" | "FW",
    skill: "1" | "2" | "3" | "4" | "5" = "3",
    shape: "1" | "2" | "3" | "4" | "5" = "3"
  ): Player => ({
    id,
    name: `Player ${id}`,
    role,
    skill,
    shape,
    gameId: "test-game",
    team: 1,
    createdAt: Date.now(),
  });

  const mockGame: Game = {
    id: "test",
    name: "Test Game",
    description: "Test game for squad matching",
    date: new Date().toISOString(),
    price: 0,
    place: "Test Field",
    numberOfPlayers: 8,
    creator: "test-creator",
    customTeams: false,
  };

  describe("splitTeams", () => {
    it("should split teams evenly with equal number of players", () => {
      const players = [
        createPlayer("1", "GK", "5", "4"),
        createPlayer("2", "GK", "4", "4"),
        createPlayer("3", "DF", "5", "5"),
        createPlayer("4", "DF", "4", "4"),
        createPlayer("5", "MF", "3", "3"),
        createPlayer("6", "MF", "3", "3"),
        createPlayer("7", "FW", "4", "4"),
        createPlayer("8", "FW", "4", "4"),
      ];

      const [team1, team2] = splitTeams(players);
      expect(team1.length).toBe(team2.length);
      expect(team1.some((p) => p.role === "GK")).toBeTruthy();
      expect(team2.some((p) => p.role === "GK")).toBeTruthy();
    });

    it("should handle odd number of players", () => {
      const players = [
        createPlayer("1", "GK", "4", "4"),
        createPlayer("2", "DF", "4", "4"),
        createPlayer("3", "MF", "3", "3"),
        createPlayer("4", "FW", "4", "4"),
        createPlayer("5", "MF", "3", "3"),
      ];

      const [team1, team2] = splitTeams(players);
      expect(Math.abs(team1.length - team2.length)).toBeLessThanOrEqual(1);
    });

    it("should distribute skills evenly", () => {
      const players = [
        createPlayer("1", "GK", "5", "5"),
        createPlayer("2", "DF", "5", "5"),
        createPlayer("3", "MF", "2", "2"),
        createPlayer("4", "FW", "2", "2"),
      ];

      const [team1, team2] = splitTeams(players);

      const getTeamScore = (team: Player[]) =>
        team.reduce((sum, p) => {
          const skillNum = p.skill ? parseInt(p.skill) : 3;
          const shapeNum = p.shape ? parseInt(p.shape) : 3;
          return sum + skillNum + shapeNum;
        }, 0);

      const team1Score = getTeamScore(team1);
      const team2Score = getTeamScore(team2);

      expect(Math.abs(team1Score - team2Score)).toBeLessThanOrEqual(4);
    });

    it("should prioritize goalkeeper distribution", () => {
      const players = [
        createPlayer("1", "GK", "4", "4"),
        createPlayer("2", "GK", "4", "4"),
        createPlayer("3", "DF", "3", "3"),
        createPlayer("4", "MF", "3", "3"),
      ];

      const [team1, team2] = splitTeams(players);
      expect(team1.some((p) => p.role === "GK")).toBeTruthy();
      expect(team2.some((p) => p.role === "GK")).toBeTruthy();
    });
  });

  describe("suggestSquads", () => {
    it("should create balanced teams with proper role distribution", () => {
      const players = [
        createPlayer("1", "GK", "4", "4"),
        createPlayer("2", "GK", "4", "4"),
        createPlayer("3", "DF", "3", "3"),
        createPlayer("4", "DF", "3", "3"),
        createPlayer("5", "MF", "3", "3"),
        createPlayer("6", "MF", "3", "3"),
        createPlayer("7", "FW", "4", "4"),
        createPlayer("8", "FW", "4", "4"),
      ];

      const [team1, team2] = suggestSquads(players, mockGame);
      expect(team1.length).toBe(4);
      expect(team2.length).toBe(4);
      expect(team1.some((p) => p.role === "GK")).toBeTruthy();
      expect(team2.some((p) => p.role === "GK")).toBeTruthy();
    });
  });
});
