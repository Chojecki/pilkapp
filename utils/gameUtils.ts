import { SupabaseClient } from "@supabase/supabase-js";
import { Player } from "../domain/game/game"; // Assuming Player type might be needed later

/**
 * Clears the is_fixed_teammate flag for all players in a specific game.
 * This is useful when game ownership changes or an organizer is removed,
 * invalidating previous fixed teammate selections.
 *
 * @param gameId The ID of the game for which to clear fixed teammates.
 * @param supabaseClient An instance of the Supabase client.
 */
export const clearFixedTeammatesForGame = async (
  gameId: string,
  supabaseClient: SupabaseClient
): Promise<{ error?: any }> => {
  if (!gameId) {
    console.error("clearFixedTeammatesForGame: gameId is required.");
    return { error: new Error("gameId is required") };
  }
  if (!supabaseClient) {
    console.error(
      "clearFixedTeammatesForGame: supabaseClient is required."
    );
    return { error: new Error("supabaseClient is required") };
  }

  try {
    const { error } = await supabaseClient
      .from("players")
      .update({ is_fixed_teammate: false })
      .eq("gameId", gameId)
      .eq("is_fixed_teammate", true); // Only update those that are currently true

    if (error) {
      console.error(
        `Error clearing fixed teammates for game ${gameId}:`,
        error
      );
      return { error };
    }

    console.log(`Successfully cleared fixed teammates for game ${gameId}.`);
    return {}; // Success
  } catch (e) {
    console.error(
      `Exception when clearing fixed teammates for game ${gameId}:`,
      e
    );
    return { error: e };
  }
};

// Example of how this function might be used (pseudo-code, not part of this file):
/*
async function handleGameOwnershipChange(newOwnerId: string, gameId: string, supabase: SupabaseClient) {
  // 1. Update game.creator in the 'games' table
  const { error: gameUpdateError } = await supabase
    .from('games')
    .update({ creator: newOwnerId })
    .eq('id', gameId);

  if (gameUpdateError) {
    // Handle error
    return;
  }

  // 2. Clear any existing fixed teammate selections for that game
  const { error: clearError } = await clearFixedTeammatesForGame(gameId, supabase);

  if (clearError) {
    // Handle error, maybe log it, but the ownership change might still be considered successful
  }

  // Refresh UI or state
}
*/
