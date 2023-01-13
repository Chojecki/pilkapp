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
          canAnonRemove: boolean | null
          city: string | null
          created_at: string | null
          creator: string | null
          creatorContact: string | null
          creatorEmail: string | null
          customTeams: boolean
          date: string | null
          description: string | null
          id: string
          ignoreLocalStorage: boolean | null
          isPublic: boolean | null
          name: string | null
          numberOfPlayers: number | null
          place: string | null
          price: number | null
          time: string | null
        }
        Insert: {
          canAnonRemove?: boolean | null
          city?: string | null
          created_at?: string | null
          creator?: string | null
          creatorContact?: string | null
          creatorEmail?: string | null
          customTeams?: boolean
          date?: string | null
          description?: string | null
          id?: string
          ignoreLocalStorage?: boolean | null
          isPublic?: boolean | null
          name?: string | null
          numberOfPlayers?: number | null
          place?: string | null
          price?: number | null
          time?: string | null
        }
        Update: {
          canAnonRemove?: boolean | null
          city?: string | null
          created_at?: string | null
          creator?: string | null
          creatorContact?: string | null
          creatorEmail?: string | null
          customTeams?: boolean
          date?: string | null
          description?: string | null
          id?: string
          ignoreLocalStorage?: boolean | null
          isPublic?: boolean | null
          name?: string | null
          numberOfPlayers?: number | null
          place?: string | null
          price?: number | null
          time?: string | null
        }
      }
      players: {
        Row: {
          created_at: string | null
          didPay: boolean | null
          gameId: string | null
          id: string
          name: string | null
          order: number | null
          role: string | null
          team: number | null
          userId: string | null
        }
        Insert: {
          created_at?: string | null
          didPay?: boolean | null
          gameId?: string | null
          id?: string
          name?: string | null
          order?: number | null
          role?: string | null
          team?: number | null
          userId?: string | null
        }
        Update: {
          created_at?: string | null
          didPay?: boolean | null
          gameId?: string | null
          id?: string
          name?: string | null
          order?: number | null
          role?: string | null
          team?: number | null
          userId?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
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
