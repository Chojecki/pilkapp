export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          created_at: string | null
          date: string | null
          description: string | null
          name: string | null
          place: string | null
          price: number | null
          creator: string | null
          time: string | null
          numberOfPlayers: number | null
          creatorContact: string | null
          id: string
          customTeams: boolean
          canAnonRemove: boolean | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          name?: string | null
          place?: string | null
          price?: number | null
          creator?: string | null
          time?: string | null
          numberOfPlayers?: number | null
          creatorContact?: string | null
          id?: string
          customTeams?: boolean
          canAnonRemove?: boolean | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          description?: string | null
          name?: string | null
          place?: string | null
          price?: number | null
          creator?: string | null
          time?: string | null
          numberOfPlayers?: number | null
          creatorContact?: string | null
          id?: string
          customTeams?: boolean
          canAnonRemove?: boolean | null
        }
      }
      players: {
        Row: {
          created_at: string | null
          name: string | null
          role: string | null
          id: string
          didPay: boolean | null
          gameId: string | null
          userId: string | null
          order: number | null
          team: number | null
        }
        Insert: {
          created_at?: string | null
          name?: string | null
          role?: string | null
          id?: string
          didPay?: boolean | null
          gameId?: string | null
          userId?: string | null
          order?: number | null
          team?: number | null
        }
        Update: {
          created_at?: string | null
          name?: string | null
          role?: string | null
          id?: string
          didPay?: boolean | null
          gameId?: string | null
          userId?: string | null
          order?: number | null
          team?: number | null
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
