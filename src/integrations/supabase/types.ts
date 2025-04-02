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
          gift_inventory: Json | null
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
          received_gifts: Json | null
          role: string | null
          trial_end_date: string | null
          updated_at: string | null
          voice_intro: string | null
        }
        Insert: {
          age?: number | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          favorite_music?: string[] | null
          gender?: string | null
          gift_inventory?: Json | null
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
          received_gifts?: Json | null
          role?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
          voice_intro?: string | null
        }
        Update: {
          age?: number | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          favorite_music?: string[] | null
          gender?: string | null
          gift_inventory?: Json | null
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
          received_gifts?: Json | null
          role?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
          voice_intro?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
