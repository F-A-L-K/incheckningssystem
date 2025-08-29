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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      CHECKIN_visitors: {
        Row: {
          check_in_time: string
          check_out_time: string | null
          checked_out: boolean
          company: string
          id: string
          is_service_personnel: boolean | null
          name: string
          visiting: string
        }
        Insert: {
          check_in_time?: string
          check_out_time?: string | null
          checked_out?: boolean
          company: string
          id?: string
          is_service_personnel?: boolean | null
          name: string
          visiting: string
        }
        Update: {
          check_in_time?: string
          check_out_time?: string | null
          checked_out?: boolean
          company?: string
          id?: string
          is_service_personnel?: boolean | null
          name?: string
          visiting?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      informationtavla_dokument: {
        Row: {
          date_created: string
          file_path: string
          id: string
          verksamhet_id: string
        }
        Insert: {
          date_created?: string
          file_path: string
          id?: string
          verksamhet_id: string
        }
        Update: {
          date_created?: string
          file_path?: string
          id?: string
          verksamhet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "informationtavla_dokument_verksamhet_id_fkey"
            columns: ["verksamhet_id"]
            isOneToOne: false
            referencedRelation: "informationtavla_verksamhet"
            referencedColumns: ["id"]
          },
        ]
      }
      informationtavla_handelser: {
        Row: {
          anmalan_sista_tid: string | null
          checkbox1: string | null
          checkbox2: string | null
          checkbox3: string | null
          created_at: string
          datum: string
          id: string
          is_updated: boolean | null
          sluttid: string | null
          starttid: string | null
          text: string | null
          titel: string
          updated_at: string | null
        }
        Insert: {
          anmalan_sista_tid?: string | null
          checkbox1?: string | null
          checkbox2?: string | null
          checkbox3?: string | null
          created_at?: string
          datum: string
          id?: string
          is_updated?: boolean | null
          sluttid?: string | null
          starttid?: string | null
          text?: string | null
          titel: string
          updated_at?: string | null
        }
        Update: {
          anmalan_sista_tid?: string | null
          checkbox1?: string | null
          checkbox2?: string | null
          checkbox3?: string | null
          created_at?: string
          datum?: string
          id?: string
          is_updated?: boolean | null
          sluttid?: string | null
          starttid?: string | null
          text?: string | null
          titel?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      informationtavla_narvarolistor: {
        Row: {
          checkbox1: boolean | null
          checkbox2: boolean | null
          checkbox3: boolean | null
          handelse_id: string
          id: string
          namn: string
        }
        Insert: {
          checkbox1?: boolean | null
          checkbox2?: boolean | null
          checkbox3?: boolean | null
          handelse_id: string
          id?: string
          namn: string
        }
        Update: {
          checkbox1?: boolean | null
          checkbox2?: boolean | null
          checkbox3?: boolean | null
          handelse_id?: string
          id?: string
          namn?: string
        }
        Relationships: [
          {
            foreignKeyName: "informationtavla_narvarolistor_handelse_id_fkey"
            columns: ["handelse_id"]
            isOneToOne: false
            referencedRelation: "informationtavla_handelser"
            referencedColumns: ["id"]
          },
        ]
      }
      informationtavla_personmallar: {
        Row: {
          created_at: string
          id: string
          namn: string
        }
        Insert: {
          created_at?: string
          id?: string
          namn: string
        }
        Update: {
          created_at?: string
          id?: string
          namn?: string
        }
        Relationships: []
      }
      informationtavla_verksamhet: {
        Row: {
          expire_at: string | null
          id: string
          is_updated: boolean | null
          text: string | null
          title: string
          type: string
          updated_at: string | null
          upload_date: string
        }
        Insert: {
          expire_at?: string | null
          id?: string
          is_updated?: boolean | null
          text?: string | null
          title: string
          type: string
          updated_at?: string | null
          upload_date?: string
        }
        Update: {
          expire_at?: string | null
          id?: string
          is_updated?: boolean | null
          text?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          upload_date?: string
        }
        Relationships: []
      }
      school_visits: {
        Row: {
          check_in_time: string
          check_out_time: string | null
          checked_out: boolean
          id: string
          school_name: string
          student_count: number
          teacher_name: string
          visiting: string | null
        }
        Insert: {
          check_in_time?: string
          check_out_time?: string | null
          checked_out?: boolean
          id?: string
          school_name: string
          student_count: number
          teacher_name: string
          visiting?: string | null
        }
        Update: {
          check_in_time?: string
          check_out_time?: string | null
          checked_out?: boolean
          id?: string
          school_name?: string
          student_count?: number
          teacher_name?: string
          visiting?: string | null
        }
        Relationships: []
      }
      underhall_checklist: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          task_id: string
          text: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          task_id: string
          text: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          task_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "underhall_checklist_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "underhall_tasks"
            referencedColumns: ["task_id"]
          },
        ]
      }
      underhall_completed_maintenance: {
        Row: {
          created_at: string
          maintenance_date: string
          maintenance_id: string
          maintenance_note: string | null
          maintenance_owner: string
          task_id: string
        }
        Insert: {
          created_at?: string
          maintenance_date?: string
          maintenance_id?: string
          maintenance_note?: string | null
          maintenance_owner: string
          task_id: string
        }
        Update: {
          created_at?: string
          maintenance_date?: string
          maintenance_id?: string
          maintenance_note?: string | null
          maintenance_owner?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "underhall_completed_maintenance_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "underhall_tasks"
            referencedColumns: ["task_id"]
          },
        ]
      }
      underhall_document: {
        Row: {
          document_id: string
          file_name: string
          file_path: string
          task_id: string
          uploaded_at: string
        }
        Insert: {
          document_id?: string
          file_name: string
          file_path: string
          task_id: string
          uploaded_at?: string
        }
        Update: {
          document_id?: string
          file_name?: string
          file_path?: string
          task_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "underhall_document_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "underhall_tasks"
            referencedColumns: ["task_id"]
          },
        ]
      }
      underhall_equipment: {
        Row: {
          created_at: string
          equipment_id: string
          equipment_location: string
          equipment_name: string
          equipment_number: number | null
        }
        Insert: {
          created_at?: string
          equipment_id?: string
          equipment_location: string
          equipment_name: string
          equipment_number?: number | null
        }
        Update: {
          created_at?: string
          equipment_id?: string
          equipment_location?: string
          equipment_name?: string
          equipment_number?: number | null
        }
        Relationships: []
      }
      underhall_maintenance: {
        Row: {
          created_at: string
          maintenance_date: string
          maintenance_id: string
          maintenance_notes: string | null
          maintenance_owner: string
          task_id: string
        }
        Insert: {
          created_at?: string
          maintenance_date?: string
          maintenance_id?: string
          maintenance_notes?: string | null
          maintenance_owner: string
          task_id: string
        }
        Update: {
          created_at?: string
          maintenance_date?: string
          maintenance_id?: string
          maintenance_notes?: string | null
          maintenance_owner?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "underhall_maintenance_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "underhall_tasks"
            referencedColumns: ["task_id"]
          },
        ]
      }
      underhall_tasks: {
        Row: {
          anchor_day: number | null
          created_at: string
          days_before_due: number | null
          equipment_id: string
          external: boolean | null
          interval_months: number | null
          next_due_on: string | null
          show_from_on: string | null
          task_id: string
          task_instruction: string | null
          task_intervall: number
          task_lastdate: string
          task_responsible: string
          task_responsible_number: number
          task_responsible2: string | null
          task_responsible3: string | null
          task_responsible4: string | null
          task_responsible5: string | null
          task_title: string
        }
        Insert: {
          anchor_day?: number | null
          created_at?: string
          days_before_due?: number | null
          equipment_id: string
          external?: boolean | null
          interval_months?: number | null
          next_due_on?: string | null
          show_from_on?: string | null
          task_id?: string
          task_instruction?: string | null
          task_intervall: number
          task_lastdate?: string
          task_responsible: string
          task_responsible_number?: number
          task_responsible2?: string | null
          task_responsible3?: string | null
          task_responsible4?: string | null
          task_responsible5?: string | null
          task_title: string
        }
        Update: {
          anchor_day?: number | null
          created_at?: string
          days_before_due?: number | null
          equipment_id?: string
          external?: boolean | null
          interval_months?: number | null
          next_due_on?: string | null
          show_from_on?: string | null
          task_id?: string
          task_instruction?: string | null
          task_intervall?: number
          task_lastdate?: string
          task_responsible?: string
          task_responsible_number?: number
          task_responsible2?: string | null
          task_responsible3?: string | null
          task_responsible4?: string | null
          task_responsible5?: string | null
          task_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "underhall_tasks_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["equipment_id"]
          },
          {
            foreignKeyName: "underhall_tasks_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "underhall_equipment"
            referencedColumns: ["equipment_id"]
          },
        ]
      }
      users: {
        Row: {
          Access_informationboard: boolean
          admin: boolean
          created_at: string
          full_name: string | null
          id: string
          password_hash: string
          username: string
        }
        Insert: {
          Access_informationboard?: boolean
          admin: boolean
          created_at?: string
          full_name?: string | null
          id?: string
          password_hash: string
          username: string
        }
        Update: {
          Access_informationboard?: boolean
          admin?: boolean
          created_at?: string
          full_name?: string | null
          id?: string
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      visitors: {
        Row: {
          check_in_time: string
          check_out_time: string | null
          checked_out: boolean
          company: string
          id: string
          is_service_personnel: boolean | null
          name: string
          visiting: string
        }
        Insert: {
          check_in_time?: string
          check_out_time?: string | null
          checked_out?: boolean
          company: string
          id?: string
          is_service_personnel?: boolean | null
          name: string
          visiting: string
        }
        Update: {
          check_in_time?: string
          check_out_time?: string | null
          checked_out?: boolean
          company?: string
          id?: string
          is_service_personnel?: boolean | null
          name?: string
          visiting?: string
        }
        Relationships: []
      }
    }
    Views: {
      equipment: {
        Row: {
          created_at: string | null
          equipment_id: string | null
          equipment_location: string | null
          equipment_name: string | null
          equipment_number: number | null
        }
        Insert: {
          created_at?: string | null
          equipment_id?: string | null
          equipment_location?: string | null
          equipment_name?: string | null
          equipment_number?: number | null
        }
        Update: {
          created_at?: string | null
          equipment_id?: string | null
          equipment_location?: string | null
          equipment_name?: string | null
          equipment_number?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_news: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      user_role: "user" | "admin"
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
    Enums: {
      app_role: ["admin", "user"],
      user_role: ["user", "admin"],
    },
  },
} as const
