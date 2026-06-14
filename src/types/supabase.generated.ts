/* eslint-disable */
/**
 * Otomatik üretilmiş dosya — elle düzenlemeyin.
 * Güncellemek için: npm run gen:types
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          message: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          title: string
          type?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      deadlines: {
        Row: {
          created_at: string
          deadline_date: string
          description: string | null
          document_id: string | null
          id: string
          reminder_enabled: boolean | null
          status: string
          title: string
          updated_at: string
          urgency: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deadline_date: string
          description?: string | null
          document_id?: string | null
          id?: string
          reminder_enabled?: boolean | null
          status?: string
          title: string
          updated_at?: string
          urgency?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deadline_date?: string
          description?: string | null
          document_id?: string | null
          id?: string
          reminder_enabled?: boolean | null
          status?: string
          title?: string
          updated_at?: string
          urgency?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deadlines_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deadlines_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_analyses: {
        Row: {
          ai_model: string | null
          analysis_json: Json | null
          confidence_score: number | null
          created_at: string
          document_id: string
          id: string
          required_actions: Json | null
          required_documents: Json | null
          risks_if_ignored: Json | null
          summary_detailed: string | null
          summary_simple: string | null
          user_id: string
        }
        Insert: {
          ai_model?: string | null
          analysis_json?: Json | null
          confidence_score?: number | null
          created_at?: string
          document_id: string
          id?: string
          required_actions?: Json | null
          required_documents?: Json | null
          risks_if_ignored?: Json | null
          summary_detailed?: string | null
          summary_simple?: string | null
          user_id: string
        }
        Update: {
          ai_model?: string | null
          analysis_json?: Json | null
          confidence_score?: number | null
          created_at?: string
          document_id?: string
          id?: string
          required_actions?: Json | null
          required_documents?: Json | null
          risks_if_ignored?: Json | null
          summary_detailed?: string | null
          summary_simple?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_analyses_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          authority_name: string | null
          created_at: string
          document_type: string | null
          extracted_text: string | null
          file_path: string
          file_size: number
          file_type: string
          id: string
          original_file_name: string
          source_language: string | null
          status: string
          target_language: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          authority_name?: string | null
          created_at?: string
          document_type?: string | null
          extracted_text?: string | null
          file_path: string
          file_size: number
          file_type: string
          id?: string
          original_file_name: string
          source_language?: string | null
          status?: string
          target_language?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          authority_name?: string | null
          created_at?: string
          document_type?: string | null
          extracted_text?: string | null
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          original_file_name?: string
          source_language?: string | null
          status?: string
          target_language?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          admin_reply: string | null
          created_at: string
          id: string
          message: string
          replied_at: string | null
          replied_by: string | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          admin_reply?: string | null
          created_at?: string
          id?: string
          message: string
          replied_at?: string | null
          replied_by?: string | null
          status?: string
          type?: string
          user_id: string
        }
        Update: {
          admin_reply?: string | null
          created_at?: string
          id?: string
          message?: string
          replied_at?: string | null
          replied_by?: string | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_replied_by_fkey"
            columns: ["replied_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_letters: {
        Row: {
          created_at: string
          document_id: string | null
          german_body: string
          id: string
          letter_type: string
          pdf_path: string | null
          subject: string
          target_language: string
          translated_explanation: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_id?: string | null
          german_body: string
          id?: string
          letter_type: string
          pdf_path?: string | null
          subject: string
          target_language?: string
          translated_explanation?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_id?: string | null
          german_body?: string
          id?: string
          letter_type?: string
          pdf_path?: string | null
          subject?: string
          target_language?: string
          translated_explanation?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_letters_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_letters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_limits: {
        Row: {
          created_at: string
          id: string
          max_file_size_mb: number
          monthly_document_limit: number
          monthly_letter_limit: number
          pdf_export_enabled: boolean
          plan: string
          reminders_enabled: boolean
          translation_enabled: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          max_file_size_mb: number
          monthly_document_limit: number
          monthly_letter_limit: number
          pdf_export_enabled?: boolean
          plan: string
          reminders_enabled?: boolean
          translation_enabled?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          max_file_size_mb?: number
          monthly_document_limit?: number
          monthly_letter_limit?: number
          pdf_export_enabled?: boolean
          plan?: string
          reminders_enabled?: boolean
          translation_enabled?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          country_of_origin: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          preferred_language: string
          role: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country_of_origin?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          preferred_language?: string
          role?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country_of_origin?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          preferred_language?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          body: Json
          content_type: string
          created_at: string
          id: string
          is_published: boolean | null
          slug: string
          sort_order: number | null
          title: Json
          updated_at: string
        }
        Insert: {
          body?: Json
          content_type: string
          created_at?: string
          id?: string
          is_published?: boolean | null
          slug: string
          sort_order?: number | null
          title?: Json
          updated_at?: string
        }
        Update: {
          body?: Json
          content_type?: string
          created_at?: string
          id?: string
          is_published?: boolean | null
          slug?: string
          sort_order?: number | null
          title?: Json
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_permissions: {
        Row: {
          created_at: string
          document_id: string
          expires_at: string | null
          granted_to: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_id: string
          expires_at?: string | null
          granted_to: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_id?: string
          expires_at?: string | null
          granted_to?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_permissions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_permissions_granted_to_fkey"
            columns: ["granted_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      template_categories: {
        Row: {
          created_at: string
          description: Json
          icon: string | null
          id: string
          name: Json
          slug: string
        }
        Insert: {
          created_at?: string
          description?: Json
          icon?: string | null
          id?: string
          name?: Json
          slug: string
        }
        Update: {
          created_at?: string
          description?: Json
          icon?: string | null
          id?: string
          name?: Json
          slug?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          category: string
          content: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          language: string
          title: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          language?: string
          title: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          language?: string
          title?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "template_categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      usage_logs: {
        Row: {
          action_type: string
          created_at: string
          document_id: string | null
          id: string
          metadata: Json | null
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          document_id?: string | null
          id?: string
          metadata?: Json | null
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          document_id?: string | null
          id?: string
          metadata?: Json | null
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
