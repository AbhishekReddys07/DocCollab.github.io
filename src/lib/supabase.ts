import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          last_modified_at: string
          visibility: 'public' | 'private'
          created_at: string
        }
        Insert: {
          id?: string
          title?: string
          content?: string
          author_id: string
          last_modified_at?: string
          visibility?: 'public' | 'private'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          last_modified_at?: string
          visibility?: 'public' | 'private'
          created_at?: string
        }
      }
      document_shares: {
        Row: {
          id: string
          document_id: string
          user_id: string
          can_edit: boolean
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          user_id: string
          can_edit?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          user_id?: string
          can_edit?: boolean
          created_at?: string
        }
      }
      document_versions: {
        Row: {
          id: string
          document_id: string
          user_id: string
          content: string
          title: string
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          user_id: string
          content: string
          title: string
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          user_id?: string
          content?: string
          title?: string
          created_at?: string
        }
      }
      mentions: {
        Row: {
          id: string
          document_id: string
          mentioned_user_id: string
          mentioning_user_id: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          mentioned_user_id: string
          mentioning_user_id: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          mentioned_user_id?: string
          mentioning_user_id?: string
          is_read?: boolean
          created_at?: string
        }
      }
    }
  }
}