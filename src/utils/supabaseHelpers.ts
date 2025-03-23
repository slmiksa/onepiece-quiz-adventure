
import { supabase } from "@/integrations/supabase/client";
import { Player } from "../components/PlayerSetup";
import { generateId } from "./quizHelpers";

// Types for database tables
export interface DbPlayer {
  id: string;
  name: string;
  avatar: string;
  created_at?: string;
}

export interface DbQuizResult {
  id: string;
  player_id: string;
  score: number;
  total_questions: number;
  difficulty: string;
  created_at?: string;
}

// Save player to database
export const savePlayerToDb = async (player: Player): Promise<DbPlayer | null> => {
  try {
    const { data, error } = await supabase
      .from('players')
      .insert({
        name: player.name,
        avatar: player.avatar
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving player:', error);
      return null;
    }
    
    console.log('Player saved:', data);
    return data;
  } catch (err) {
    console.error('Exception saving player:', err);
    return null;
  }
};

// Save multiple players to database
export const savePlayersToDb = async (players: Player[]): Promise<Record<number, string>> => {
  const playerIdMap: Record<number, string> = {};
  
  for (const player of players) {
    const savedPlayer = await savePlayerToDb(player);
    if (savedPlayer) {
      playerIdMap[player.id] = savedPlayer.id;
    }
  }
  
  return playerIdMap;
};

// Save quiz result to database
export const saveQuizResult = async (
  playerId: string, 
  score: number, 
  totalQuestions: number, 
  difficulty: string
): Promise<DbQuizResult | null> => {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .insert({
        player_id: playerId,
        score,
        total_questions: totalQuestions,
        difficulty
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving quiz result:', error);
      return null;
    }
    
    console.log('Quiz result saved:', data);
    return data;
  } catch (err) {
    console.error('Exception saving quiz result:', err);
    return null;
  }
};

// Get top scores
export const getTopScores = async (limit: number = 10): Promise<DbQuizResult[]> => {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select(`
        *,
        players:player_id (
          name,
          avatar
        )
      `)
      .order('score', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching top scores:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception fetching top scores:', err);
    return [];
  }
};
