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
      api_keys: {
        Row: {
          api_key: string
          api_secret: string
          created_at: string | null
          exchange: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key: string
          api_secret: string
          created_at?: string | null
          exchange: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          api_key?: string
          api_secret?: string
          created_at?: string | null
          exchange?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trade_sync_history: {
        Row: {
          api_key_id: string
          created_at: string
          error_message: string | null
          exchange: string
          id: string
          status: string
          sync_end_time: string | null
          sync_start_time: string
          trades_synced: number | null
          user_id: string
        }
        Insert: {
          api_key_id: string
          created_at?: string
          error_message?: string | null
          exchange: string
          id?: string
          status?: string
          sync_end_time?: string | null
          sync_start_time?: string
          trades_synced?: number | null
          user_id?: string
        }
        Update: {
          api_key_id?: string
          created_at?: string
          error_message?: string | null
          exchange?: string
          id?: string
          status?: string
          sync_end_time?: string | null
          sync_start_time?: string
          trades_synced?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_api_key"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_sync_history_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      user_trades: {
        Row: {
          amount: number | null
          created_at: string
          date: string
          entry_price: number | null
          exchange_id: string | null
          exchange_order_id: string | null
          exit_price: number | null
          fee: number | null
          id: string
          is_synchronized: boolean | null
          last_synced_at: string | null
          notes: string | null
          pnl: number
          symbol: string
          type: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          date: string
          entry_price?: number | null
          exchange_id?: string | null
          exchange_order_id?: string | null
          exit_price?: number | null
          fee?: number | null
          id?: string
          is_synchronized?: boolean | null
          last_synced_at?: string | null
          notes?: string | null
          pnl: number
          symbol: string
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          date?: string
          entry_price?: number | null
          exchange_id?: string | null
          exchange_order_id?: string | null
          exit_price?: number | null
          fee?: number | null
          id?: string
          is_synchronized?: boolean | null
          last_synced_at?: string | null
          notes?: string | null
          pnl?: number
          symbol?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      trades_type: "sell" | "buy"
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
