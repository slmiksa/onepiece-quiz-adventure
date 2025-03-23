
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

export interface SharedQuiz {
  id: string;
  players: Player[];
  difficulty: string;
  created_at?: string;
  status: 'waiting' | 'playing' | 'finished';
}

export interface DbUser {
  id: string;
  username: string;
  avatar: string;
  created_at: string;
}

export interface DbRoom {
  id: string;
  name: string;
  owner_id: string;
  status: 'waiting' | 'playing' | 'finished';
  difficulty: string;
  max_players: number;
  created_at: string;
}

export interface DbRoomPlayer {
  id: string;
  room_id: string;
  user_id: string;
  ready: boolean;
  created_at: string;
}

export interface DbRoomMessage {
  id: string;
  room_id: string;
  user_id: string;
  message: string;
  created_at: string;
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

// Create a shared quiz
export const createSharedQuiz = async (players: Player[], difficulty: string): Promise<string | null> => {
  try {
    // Generate a short random ID for the quiz
    const quizId = generateId(); // Fixed: Removed the argument here
    
    // Store the shared quiz in localStorage for now (in a real app, use Supabase Realtime)
    const sharedQuiz: SharedQuiz = {
      id: quizId,
      players,
      difficulty,
      status: 'waiting'
    };
    
    localStorage.setItem(`quiz_${quizId}`, JSON.stringify(sharedQuiz));
    
    return quizId;
  } catch (err) {
    console.error('Exception creating shared quiz:', err);
    return null;
  }
};

// Get a shared quiz
export const getSharedQuiz = async (quizId: string): Promise<SharedQuiz | null> => {
  try {
    const quizData = localStorage.getItem(`quiz_${quizId}`);
    if (!quizData) return null;
    
    return JSON.parse(quizData) as SharedQuiz;
  } catch (err) {
    console.error('Exception getting shared quiz:', err);
    return null;
  }
};

// Join a shared quiz
export const joinSharedQuiz = async (quizId: string, player: Player): Promise<boolean> => {
  try {
    const sharedQuiz = await getSharedQuiz(quizId);
    if (!sharedQuiz) return false;
    
    // Check if we already have 4 players
    if (sharedQuiz.players.length >= 4) return false;
    
    // Add the new player
    sharedQuiz.players.push({
      ...player,
      id: sharedQuiz.players.length + 1
    });
    
    // Update the quiz in localStorage
    localStorage.setItem(`quiz_${quizId}`, JSON.stringify(sharedQuiz));
    
    return true;
  } catch (err) {
    console.error('Exception joining shared quiz:', err);
    return false;
  }
};

// Room functions
export const getRoomById = async (roomId: string): Promise<DbRoom | null> => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();
    
    if (error) {
      console.error('Error fetching room:', error);
      return null;
    }
    
    return data as DbRoom;
  } catch (err) {
    console.error('Exception fetching room:', err);
    return null;
  }
};

export const getRoomPlayers = async (roomId: string): Promise<DbRoomPlayer[]> => {
  try {
    const { data, error } = await supabase
      .from('room_players')
      .select(`
        *,
        users (username, avatar)
      `)
      .eq('room_id', roomId);
    
    if (error) {
      console.error('Error fetching room players:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception fetching room players:', err);
    return [];
  }
};

export const joinRoom = async (roomId: string, userId: string): Promise<boolean> => {
  try {
    // Check if user is already in the room
    const { data: existingPlayer, error: checkError } = await supabase
      .from('room_players')
      .select('*')
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking player in room:', checkError);
      return false;
    }
    
    if (existingPlayer) {
      return true; // Already joined
    }
    
    // Add player to room
    const { error } = await supabase
      .from('room_players')
      .insert({
        room_id: roomId,
        user_id: userId,
        ready: false
      });
    
    if (error) {
      console.error('Error joining room:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception joining room:', err);
    return false;
  }
};

export const setPlayerReady = async (roomId: string, userId: string, isReady: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('room_players')
      .update({ ready: isReady })
      .eq('room_id', roomId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error updating player ready status:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception updating player ready status:', err);
    return false;
  }
};

export const startGame = async (roomId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('rooms')
      .update({ status: 'playing' as const })
      .eq('id', roomId);
    
    if (error) {
      console.error('Error starting game:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception starting game:', err);
    return false;
  }
};

export const sendMessage = async (roomId: string, userId: string, message: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('room_messages')
      .insert({
        room_id: roomId,
        user_id: userId,
        message
      });
    
    if (error) {
      console.error('Error sending message:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception sending message:', err);
    return false;
  }
};

export const getRoomMessages = async (roomId: string): Promise<DbRoomMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('room_messages')
      .select(`
        *,
        users (username, avatar)
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching room messages:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception fetching room messages:', err);
    return [];
  }
};
