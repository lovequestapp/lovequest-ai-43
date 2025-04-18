export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      gift_transactions: {
        Row: {
          amount: number
          created_at: string
          gift_type: string
          id: string
          purchase_amount: number | null
          recipient_id: string | null
          sender_id: string
          transaction_type: string
        }
        Insert: {
          amount: number
          created_at?: string
          gift_type: string
          id?: string
          purchase_amount?: number | null
          recipient_id?: string | null
          sender_id: string
          transaction_type: string
        }
        Update: {
          amount?: number
          created_at?: string
          gift_type?: string
          id?: string
          purchase_amount?: number | null
          recipient_id?: string | null
          sender_id?: string
          transaction_type?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string
          id: string
          status: string | null
          user1_id: string | null
          user2_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          status?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          id: string
          is_flagged: boolean | null
          is_read: boolean | null
          receiver_id: string | null
          sender_id: string | null
          status: string | null
          timestamp: string | null
        }
        Insert: {
          content?: string | null
          id?: string
          is_flagged?: boolean | null
          is_read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
          status?: string | null
          timestamp?: string | null
        }
        Update: {
          content?: string | null
          id?: string
          is_flagged?: boolean | null
          is_read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
          status?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          bio: string | null
          created_at: string | null
          email: string | null
          favorite_music: string[] | null
          gender: string | null
          gift_inventory: Json
          id: string
          interested_in: string[] | null
          interests: string[] | null
          is_banned: boolean | null
          is_verified: boolean | null
          location: string | null
          name: string | null
          personality_traits: string[] | null
          photos: string[] | null
          popularity_points: number | null
          premium_status: string | null
          received_gifts: Json
          role: string | null
          trial_end_date: string | null
          updated_at: string | null
          verification_status: string
          voice_intro: string | null
        }
        Insert: {
          age?: number | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          favorite_music?: string[] | null
          gender?: string | null
          gift_inventory?: Json
          id: string
          interested_in?: string[] | null
          interests?: string[] | null
          is_banned?: boolean | null
          is_verified?: boolean | null
          location?: string | null
          name?: string | null
          personality_traits?: string[] | null
          photos?: string[] | null
          popularity_points?: number | null
          premium_status?: string | null
          received_gifts?: Json
          role?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
          verification_status?: string
          voice_intro?: string | null
        }
        Update: {
          age?: number | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          favorite_music?: string[] | null
          gender?: string | null
          gift_inventory?: Json
          id?: string
          interested_in?: string[] | null
          interests?: string[] | null
          is_banned?: boolean | null
          is_verified?: boolean | null
          location?: string | null
          name?: string | null
          personality_traits?: string[] | null
          photos?: string[] | null
          popularity_points?: number | null
          premium_status?: string | null
          received_gifts?: Json
          role?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
          verification_status?: string
          voice_intro?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          max_age: number | null
          max_distance: number | null
          min_age: number | null
          preferred_gender: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          max_age?: number | null
          max_distance?: number | null
          min_age?: number | null
          preferred_gender?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          max_age?: number | null
          max_distance?: number | null
          min_age?: number | null
          preferred_gender?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      verification_notifications: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          status: string
          user_id: string
          verification_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          status?: string
          user_id: string
          verification_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          status?: string
          user_id?: string
          verification_id?: string | null
        }
        Relationships: []
      }
      verification_requests: {
        Row: {
          admin_notes: string | null
          biometric_match_score: number | null
          created_at: string | null
          document_url: string | null
          id: string
          selfie_url: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string
          verification_id: string | null
          verification_status: string
          verified_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          biometric_match_score?: number | null
          created_at?: string | null
          document_url?: string | null
          id?: string
          selfie_url?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
          verification_id?: string | null
          verification_status?: string
          verified_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          biometric_match_score?: number | null
          created_at?: string | null
          document_url?: string | null
          id?: string
          selfie_url?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
          verification_id?: string | null
          verification_status?: string
          verified_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_sql: {
        Args: { query: string; params?: Json }
        Returns: Json
      }
      get_profile_by_id: {
        Args: { profile_id: string } | { user_id: number }
        Returns: {
          age: number | null
          bio: string | null
          created_at: string | null
          email: string | null
          favorite_music: string[] | null
          gender: string | null
          gift_inventory: Json
          id: string
          interested_in: string[] | null
          interests: string[] | null
          is_banned: boolean | null
          is_verified: boolean | null
          location: string | null
          name: string | null
          personality_traits: string[] | null
          photos: string[] | null
          popularity_points: number | null
          premium_status: string | null
          received_gifts: Json
          role: string | null
          trial_end_date: string | null
          updated_at: string | null
          verification_status: string
          voice_intro: string | null
        }[]
      }
      get_user_profile_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      is_profile_owner: {
        Args: Record<PropertyKey, never> | { profile_id: string }
        Returns: boolean
      }
      update_profile_data: {
        Args: { profile_id: string; profile_data: Json }
        Returns: boolean
      }
      update_profile_field: {
        Args: { profile_id: string; field_name: string; field_value: Json }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
