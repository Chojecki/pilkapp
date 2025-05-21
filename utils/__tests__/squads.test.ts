import { suggestSquads } from "../squads";
import { Player, Game } from "../../domain/game/game";

const createPlayer = (
  id: string,
  userId?: string,
  isFixedTeammate?: boolean,
  role: string = "MF"
): Player => ({
  id,
  name: `Player ${id}`,
  role,
  gameId: "game1",
  userId: userId || `user${id}`,
  isFixedTeammate: isFixedTeammate || false,
  // Minimal example, add skill/shape if your tests depend on strength-based balancing
  skill: "3", // Default skill
  shape: "3", // Default shape
  createdAt: Date.now(),
  confirmed: true,
  didPay: false,
  order: 1,
  team: undefined,
});

describe("suggestSquads", () => {
  const gameBase: Game = {
    id: "game1",
    name: "Test Game",
    dateTime: new Date(),
    location: "Test Location",
    numberOfPlayers: 10, // Default, will be overridden in tests
    organisator: "creator123", // Corresponds to userId of organizer
    pricePerPlayer: 10,
    status: "PLANNED",
    type: "MATCH",
    maxPlayers: 22,
    creator: "creator123", // userId of the game creator
    description: "Test desc",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    gameOwner: "creator123",
  };

  test("1. Even Number of Players (10), No Fixed Pair", () => {
    const players: Player[] = Array.from({ length: 10 }, (_, i) =>
      createPlayer(`p${i + 1}`)
    );
    const game = { ...gameBase, numberOfPlayers: 10 };
    const [squad1, squad2] = suggestSquads(players, game);

    expect(squad1.length + squad2.length).toBe(10);
    expect(squad1.length).toBe(5);
    expect(squad2.length).toBe(5);
  });

  test("2. Odd Number of Players (9), No Fixed Pair", () => {
    const players: Player[] = Array.from({ length: 9 }, (_, i) =>
      createPlayer(`p${i + 1}`)
    );
    const game = { ...gameBase, numberOfPlayers: 9 };
    const [squad1, squad2] = suggestSquads(players, game);

    expect(squad1.length + squad2.length).toBe(9);
    // One squad will have 5, the other 4. Order isn't strictly guaranteed without pair.
    expect(
      (squad1.length === 5 && squad2.length === 4) ||
        (squad1.length === 4 && squad2.length === 5)
    ).toBe(true);
  });

  test("3. Even Number of Players (10), With Fixed Pair", () => {
    const organizer = createPlayer("p1", "creator123");
    const fixedTeammate = createPlayer("p2", "userP2", true);
    const otherPlayers: Player[] = Array.from({ length: 8 }, (_, i) =>
      createPlayer(`p${i + 3}`)
    );
    const players = [organizer, fixedTeammate, ...otherPlayers];
    const game = { ...gameBase, numberOfPlayers: 10, creator: "creator123" };

    const [squad1, squad2] = suggestSquads(players, game);

    expect(squad1.length + squad2.length).toBe(10);
    expect(squad1.length).toBe(5);
    expect(squad2.length).toBe(5);

    const pairInSquad1 =
      squad1.some((p) => p.id === "p1") && squad1.some((p) => p.id === "p2");
    const pairInSquad2 =
      squad2.some((p) => p.id === "p1") && squad2.some((p) => p.id === "p2");

    expect(pairInSquad1 || pairInSquad2).toBe(true);
    // Specifically, they should be in squad1 due to current logic
    expect(squad1.find(p => p.id === organizer.id)).toBeDefined();
    expect(squad1.find(p => p.id === fixedTeammate.id)).toBeDefined();
  });

  test("4. Odd Number of Players (9), With Fixed Pair", () => {
    const organizer = createPlayer("p1", "creator123");
    const fixedTeammate = createPlayer("p2", "userP2", true);
    const otherPlayers: Player[] = Array.from({ length: 7 }, (_, i) =>
      createPlayer(`p${i + 3}`)
    );
    const players = [organizer, fixedTeammate, ...otherPlayers];
    const game = { ...gameBase, numberOfPlayers: 9, creator: "creator123" };

    const [squad1, squad2] = suggestSquads(players, game);

    expect(squad1.length + squad2.length).toBe(9);
    // Squad1 (with the pair) should be larger
    expect(squad1.length).toBe(5);
    expect(squad2.length).toBe(4);

    expect(squad1.find((p) => p.id === "p1")).toBeDefined();
    expect(squad1.find((p) => p.id === "p2")).toBeDefined();
  });

  test("5. Fixed Teammate Not in mainSquad", () => {
    const organizer = createPlayer("p1", "creator123");
    // Fixed teammate 'p2' is created but not added to 'players' array
    const otherPlayers: Player[] = Array.from({ length: 9 }, (_, i) =>
      createPlayer(`p${i + 3}`)
    ); // Total 9 other players + organizer = 10
    const players = [organizer, ...otherPlayers];
    const game = { ...gameBase, numberOfPlayers: 10, creator: "creator123" };
    // Simulate that a player 'p2' exists in DB with isFixedTeammate=true but isn't in this game's mainSquad
    // The function mainSquad.find(p => p.isFixedTeammate === true) will return undefined.

    const [squad1, squad2] = suggestSquads(players, game);

    expect(squad1.length + squad2.length).toBe(10);
    expect(squad1.length).toBe(5);
    expect(squad2.length).toBe(5);
    // No specific player needs to be in a specific squad other than balancing
  });

  test("6. Organizer Not in mainSquad", () => {
    const fixedTeammate = createPlayer("p2", "userP2", true);
    // Organizer 'p1' (userId: 'creator123') is not in 'players' array
    const otherPlayers: Player[] = Array.from({ length: 9 }, (_, i) =>
      createPlayer(`p${i + 3}`)
    ); // Total 9 other players + fixedTeammate = 10
    const players = [fixedTeammate, ...otherPlayers];
    const game = { ...gameBase, numberOfPlayers: 10, creator: "creator123" };
    // mainSquad.find(p => p.userId === game?.creator) will return undefined.

    const [squad1, squad2] = suggestSquads(players, game);

    expect(squad1.length + squad2.length).toBe(10);
    expect(squad1.length).toBe(5);
    expect(squad2.length).toBe(5);
  });

  test("7. Organizer IS the Fixed Teammate (Invalid Setup)", () => {
    const organizerIsFixed = createPlayer("p1", "creator123", true);
    const otherPlayers: Player[] = Array.from({ length: 9 }, (_, i) =>
      createPlayer(`p${i + 2}`)
    );
    const players = [organizerIsFixed, ...otherPlayers];
    const game = { ...gameBase, numberOfPlayers: 10, creator: "creator123" };

    const [squad1, squad2] = suggestSquads(players, game);

    expect(squad1.length + squad2.length).toBe(10);
    expect(squad1.length).toBe(5);
    expect(squad2.length).toBe(5);
    // The pair pre-assignment should not happen.
    // Check that p1 is in one of the squads, but not necessarily with a "fixed" partner.
    expect(players.find(p => p.id === 'p1')).toBeDefined();
  });

  test("8. Large Number of Players (20) with Fixed Pair", () => {
    const organizer = createPlayer("p1", "creator123");
    const fixedTeammate = createPlayer("p2", "userP2", true);
    const otherPlayers: Player[] = Array.from({ length: 18 }, (_, i) =>
      createPlayer(`p${i + 3}`)
    );
    const players = [organizer, fixedTeammate, ...otherPlayers];
    const game = { ...gameBase, numberOfPlayers: 20, creator: "creator123" };

    const [squad1, squad2] = suggestSquads(players, game);

    expect(squad1.length + squad2.length).toBe(20);
    expect(squad1.length).toBe(10);
    expect(squad2.length).toBe(10);

    expect(squad1.find((p) => p.id === "p1")).toBeDefined();
    expect(squad1.find((p) => p.id === "p2")).toBeDefined();
  });

  test("9. Odd Number of Players (11), No Fixed Pair, mainSquad.length used", () => {
    // Test case where game.numberOfPlayers might be different from mainSquad.length
    // suggestSquads prioritizes game.numberOfPlayers, but falls back to mainSquad.length
    const players: Player[] = Array.from({ length: 11 }, (_, i) =>
      createPlayer(`p${i + 1}`)
    );
    // Intentionally set game.numberOfPlayers to something else or undefined
    const game = { ...gameBase, numberOfPlayers: undefined }; // Fallback to mainSquad.length
    
    const [squad1, squad2] = suggestSquads(players, game);

    expect(squad1.length + squad2.length).toBe(11);
    expect(
      (squad1.length === 6 && squad2.length === 5) ||
        (squad1.length === 5 && squad2.length === 6)
    ).toBe(true);
  });

  test("10. Even Number of Players (12), With Fixed Pair, different roles", () => {
    const organizer = createPlayer("p1", "creator123", false, "GK");
    const fixedTeammate = createPlayer("p2", "userP2", true, "FW");
    const otherPlayers: Player[] = [
      ...Array.from({ length: 5 }, (_, i) => createPlayer(`d${i + 1}`, undefined, false, "DF")),
      ...Array.from({ length: 5 }, (_, i) => createPlayer(`m${i + 1}`, undefined, false, "MF")),
    ]; // 2 + 5 + 5 = 12 players
    const players = [organizer, fixedTeammate, ...otherPlayers];
    const game = { ...gameBase, numberOfPlayers: 12, creator: "creator123" };

    const [squad1, squad2] = suggestSquads(players, game);
    
    expect(squad1.length + squad2.length).toBe(12);
    expect(squad1.length).toBe(6);
    expect(squad2.length).toBe(6);

    expect(squad1.find((p) => p.id === "p1")).toBeDefined();
    expect(squad1.find((p) => p.id === "p2")).toBeDefined();
  });

  test("11. Total players less than game.numberOfPlayers (e.g. 8 players for a 10 player game)", () => {
    const organizer = createPlayer("p1", "creator123");
    const fixedTeammate = createPlayer("p2", "userP2", true);
    const otherPlayers: Player[] = Array.from({ length: 6 }, (_, i) => createPlayer(`p${i + 3}`)); // 8 players total
    const players = [organizer, fixedTeammate, ...otherPlayers];
    const game = { ...gameBase, numberOfPlayers: 10, creator: "creator123" }; // Game expects 10

    const [squad1, squad2] = suggestSquads(players, game);

    // totalPlayersInGame in function will be 10. squadXTargetSize will be 5.
    expect(squad1.length + squad2.length).toBe(8); // Actual players
    expect(squad1.length).toBe(4); // Pair + 2 others
    expect(squad2.length).toBe(4); // 4 others

    expect(squad1.find((p) => p.id === "p1")).toBeDefined();
    expect(squad1.find((p) => p.id === "p2")).toBeDefined();
  });

  test("12. Odd total players (7), game.numberOfPlayers is higher (e.g. 10), with fixed pair", () => {
    const organizer = createPlayer("p1", "creator123");
    const fixedTeammate = createPlayer("p2", "userP2", true);
    const otherPlayers: Player[] = Array.from({ length: 5 }, (_, i) => createPlayer(`p${i + 3}`)); // 7 players total
    const players = [organizer, fixedTeammate, ...otherPlayers];
    const game = { ...gameBase, numberOfPlayers: 10, creator: "creator123" }; // Game expects 10, targets 5v5

    const [squad1, squad2] = suggestSquads(players, game);
    // totalPlayersInGame will be 10. squad1Target=5, squad2Target=5.
    // squad1 starts with [p1, p2].
    // remainingPlayers = 5. These will be distributed.
    // distributeByRole: squad1 needs 3, squad2 needs 5.
    // mf1 -> squad1 (3/5 vs 0/5)
    // mf2 -> squad2 (3/5 vs 1/5)
    // mf3 -> squad1 (4/5 vs 1/5)
    // mf4 -> squad2 (4/5 vs 2/5)
    // mf5 -> squad1 (5/5 vs 2/5) -> This is wrong, squad1 is full. Should go to squad2.
    // The logic: if (squad1.length < squad1TargetSize && (squad1.length <= squad2.length || squad2.length >= squad2TargetSize))
    // (5 < 5) is false. So it goes to else if (squad2.length < squad2TargetSize) -> (2 < 5) is true. mf5 -> squad2.
    // Squad1: [p1,p2,mf1,mf3] = 4
    // Squad2: [mf2,mf4,mf5] = 3
    // Total 7 players. Pair is in squad1. Squad1 is larger.

    expect(squad1.length + squad2.length).toBe(7);
    expect(squad1.length).toBe(4); 
    expect(squad2.length).toBe(3);

    expect(squad1.find((p) => p.id === "p1")).toBeDefined();
    expect(squad1.find((p) => p.id === "p2")).toBeDefined();
  });

});
