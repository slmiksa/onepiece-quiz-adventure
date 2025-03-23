
import { supabase } from "@/integrations/supabase/client";
import { Player } from "../components/PlayerSetup";
import { generateId } from "./quizHelpers";
import { Json } from "@/integrations/supabase/types";

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
  role: 'user' | 'admin' | 'super_admin';
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

export interface DbAnnouncement {
  id: string;
  title: string;
  content: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface DbAvatar {
  id: string;
  name: string;
  image_url: string;
  category: string;
  created_at: string;
}

export interface DbMangaPage {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  chapter: number;
  page_number: number;
  created_at: string;
  created_by?: string;
}

export interface DbQuestion {
  id: string;
  question: string;
  options: QuestionOption[];
  correct_answer: string;
  difficulty: string;
  category: string;
  created_at: string;
  created_by?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
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
    const quizId = generateId();
    
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
    
    if (sharedQuiz.players.length >= 4) return false;
    
    sharedQuiz.players.push({
      ...player,
      id: sharedQuiz.players.length + 1
    });
    
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
      return true;
    }
    
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

// Admin functions

// Send welcome email to new user
export const sendWelcomeEmail = async (email: string, username: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke("send-welcome-email", {
      body: { email, username }
    });
    
    if (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
    
    console.log('Welcome email sent:', data);
    return true;
  } catch (err) {
    console.error('Exception sending welcome email:', err);
    return false;
  }
};

// Get all users for admin panel
export const getAllUsers = async (): Promise<DbUser[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception fetching users:', err);
    return [];
  }
};

// Update user role
export const updateUserRole = async (userId: string, role: 'user' | 'admin' | 'super_admin'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user role:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception updating user role:', err);
    return false;
  }
};

// Announcement functions
export const createAnnouncement = async (
  title: string,
  content: string,
  active: boolean = true
): Promise<DbAnnouncement | null> => {
  try {
    const user = supabase.auth.getUser();
    const { data, error } = await supabase
      .from('announcements')
      .insert({
        title,
        content,
        active,
        created_by: (await user).data.user?.id
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating announcement:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Exception creating announcement:', err);
    return null;
  }
};

export const getAnnouncements = async (onlyActive: boolean = false): Promise<DbAnnouncement[]> => {
  try {
    let query = supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (onlyActive) {
      query = query.eq('active', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception fetching announcements:', err);
    return [];
  }
};

export const updateAnnouncement = async (
  id: string,
  updates: Partial<Pick<DbAnnouncement, 'title' | 'content' | 'active'>>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('announcements')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating announcement:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception updating announcement:', err);
    return false;
  }
};

export const deleteAnnouncement = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting announcement:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception deleting announcement:', err);
    return false;
  }
};

// Avatar management functions
export const createAvatar = async (
  name: string,
  imageUrl: string,
  category: string
): Promise<DbAvatar | null> => {
  try {
    const { data, error } = await supabase
      .from('avatars')
      .insert({
        name,
        image_url: imageUrl,
        category
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating avatar:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Exception creating avatar:', err);
    return null;
  }
};

export const getAvatars = async (category?: string): Promise<DbAvatar[]> => {
  try {
    let query = supabase
      .from('avatars')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching avatars:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception fetching avatars:', err);
    return [];
  }
};

export const deleteAvatar = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('avatars')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting avatar:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception deleting avatar:', err);
    return false;
  }
};

// Manga pages functions
export const createMangaPage = async (
  title: string,
  imageUrl: string,
  chapter: number,
  pageNumber: number,
  description?: string
): Promise<DbMangaPage | null> => {
  try {
    const user = supabase.auth.getUser();
    const { data, error } = await supabase
      .from('manga_pages')
      .insert({
        title,
        image_url: imageUrl,
        chapter,
        page_number: pageNumber,
        description,
        created_by: (await user).data.user?.id
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating manga page:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Exception creating manga page:', err);
    return null;
  }
};

export const getMangaPages = async (chapter?: number): Promise<DbMangaPage[]> => {
  try {
    let query = supabase
      .from('manga_pages')
      .select('*')
      .order('chapter', { ascending: true })
      .order('page_number', { ascending: true });
    
    if (chapter !== undefined) {
      query = query.eq('chapter', chapter);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching manga pages:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception fetching manga pages:', err);
    return [];
  }
};

export const updateMangaPage = async (
  id: string,
  updates: Partial<Pick<DbMangaPage, 'title' | 'description' | 'image_url' | 'chapter' | 'page_number'>>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('manga_pages')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating manga page:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception updating manga page:', err);
    return false;
  }
};

export const deleteMangaPage = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('manga_pages')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting manga page:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception deleting manga page:', err);
    return false;
  }
};

// Quiz questions functions
export const createQuestion = async (
  question: string,
  options: QuestionOption[],
  correctAnswer: string,
  difficulty: string,
  category: string
): Promise<DbQuestion | null> => {
  try {
    const user = supabase.auth.getUser();
    const { data, error } = await supabase
      .from('questions')
      .insert({
        question,
        options: options as unknown as Json,
        correct_answer: correctAnswer,
        difficulty,
        category,
        created_by: (await user).data.user?.id
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating question:', error);
      return null;
    }
    
    return {
      ...data,
      options: data.options as unknown as QuestionOption[]
    } as DbQuestion;
  } catch (err) {
    console.error('Exception creating question:', err);
    return null;
  }
};

export const getQuestions = async (
  difficulty?: string,
  category?: string
): Promise<DbQuestion[]> => {
  try {
    let query = supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
    
    return data.map(item => ({
      ...item,
      options: item.options as unknown as QuestionOption[]
    })) as DbQuestion[];
  } catch (err) {
    console.error('Exception fetching questions:', err);
    return [];
  }
};

export const updateQuestion = async (
  id: string,
  updates: Partial<Pick<DbQuestion, 'question' | 'options' | 'correct_answer' | 'difficulty' | 'category'>>
): Promise<boolean> => {
  try {
    // Create a new object with the updates that will be sent to Supabase
    const supabaseUpdates: Record<string, any> = {};
    
    // Copy over simple string properties
    if (updates.question) supabaseUpdates.question = updates.question;
    if (updates.correct_answer) supabaseUpdates.correct_answer = updates.correct_answer;
    if (updates.difficulty) supabaseUpdates.difficulty = updates.difficulty;
    if (updates.category) supabaseUpdates.category = updates.category;
    
    // Handle the options property with the proper type conversion
    if (updates.options) {
      supabaseUpdates.options = updates.options as unknown as Json;
    }
    
    const { error } = await supabase
      .from('questions')
      .update(supabaseUpdates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating question:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception updating question:', err);
    return false;
  }
};

export const deleteQuestion = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting question:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception deleting question:', err);
    return false;
  }
};

// Check if current user is admin
export const isUserAdmin = async (): Promise<boolean> => {
  try {
    const user = await supabase.auth.getUser();
    
    if (!user.data.user) return false;
    
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.data.user.id)
      .single();
    
    if (error || !data) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return data.role === 'admin' || data.role === 'super_admin';
  } catch (err) {
    console.error('Exception checking admin status:', err);
    return false;
  }
};

// Check if current user is super admin
export const isUserSuperAdmin = async (): Promise<boolean> => {
  try {
    const user = await supabase.auth.getUser();
    
    if (!user.data.user) return false;
    
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.data.user.id)
      .single();
    
    if (error || !data) {
      console.error('Error checking super admin status:', error);
      return false;
    }
    
    return data.role === 'super_admin';
  } catch (err) {
    console.error('Exception checking super admin status:', err);
    return false;
  }
};
