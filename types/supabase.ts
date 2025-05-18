export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          phone_number: string | null
          aadhaar_number: string | null
          address: string | null
          city: string | null
          state: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone_number?: string | null
          aadhaar_number?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone_number?: string | null
          aadhaar_number?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transcripts: {
        Row: {
          id: string
          user_id: string
          language: string
          transcript: string
          audio_duration: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language: string
          transcript: string
          audio_duration?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language?: string
          transcript?: string
          audio_duration?: number | null
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_type: string
          file_size: number
          file_url: string
          language: string | null
          summary: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_type: string
          file_size: number
          file_url: string
          language?: string | null
          summary?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_type?: string
          file_size?: number
          file_url?: string
          language?: string | null
          summary?: string | null
          created_at?: string
        }
      }
      forms: {
        Row: {
          id: string
          user_id: string
          form_type: string
          form_data: Json
          original_text: string | null
          status: string
          tracking_id: string | null
          submitted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          form_type: string
          form_data: Json
          original_text?: string | null
          status: string
          tracking_id?: string | null
          submitted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          form_type?: string
          form_data?: Json
          original_text?: string | null
          status?: string
          tracking_id?: string | null
          submitted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      document_verifications: {
        Row: {
          id: string
          user_id: string
          document_type: string
          document_id: string
          verification_result: Json
          verified_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          document_type: string
          document_id: string
          verification_result: Json
          verified_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          document_type?: string
          document_id?: string
          verification_result?: Json
          verified_at?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          read?: boolean
          created_at?: string
        }
      }
    }
  }
}
