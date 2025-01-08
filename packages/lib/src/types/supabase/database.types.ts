export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string | null
          id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: string
          title?: string | null
          updated_at: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          date: string
          hours: string | null
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          hours?: string | null
          id: string
          name?: string | null
          updated_at: string
        }
        Update: {
          created_at?: string
          date?: string
          hours?: string | null
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          created_at: string
          id: string
          problem: string | null
          solution: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          problem?: string | null
          solution?: string | null
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: string
          problem?: string | null
          solution?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      characteristics: {
        Row: {
          created_at: string
          details: string | null
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id: string
          name?: string | null
          updated_at: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string
          id: string
          link: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          link: string
          name: string
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      educations: {
        Row: {
          created_at: string
          degree: string
          description: string | null
          field_of_study: string
          finished_at: string | null
          gpa: string | null
          id: string
          institution: string
          institution_link: string
          started_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          degree: string
          description?: string | null
          field_of_study: string
          finished_at?: string | null
          gpa?: string | null
          id: string
          institution: string
          institution_link: string
          started_at: string
          updated_at: string
        }
        Update: {
          created_at?: string
          degree?: string
          description?: string | null
          field_of_study?: string
          finished_at?: string | null
          gpa?: string | null
          id?: string
          institution?: string
          institution_link?: string
          started_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          achievements: string[] | null
          companyId: string | null
          created_at: string
          finished_at: string | null
          id: string
          role: string
          started_at: string
          updated_at: string
        }
        Insert: {
          achievements?: string[] | null
          companyId?: string | null
          created_at?: string
          finished_at?: string | null
          id: string
          role: string
          started_at: string
          updated_at: string
        }
        Update: {
          achievements?: string[] | null
          companyId?: string | null
          created_at?: string
          finished_at?: string | null
          id?: string
          role?: string
          started_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiences_companyId_fkey"
            columns: ["companyId"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          created_at: string
          id: string
          name: string | null
          proficiency: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name?: string | null
          proficiency?: string | null
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          proficiency?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_skills: {
        Row: {
          project_id: string
          skill_id: string
        }
        Insert: {
          project_id: string
          skill_id: string
        }
        Update: {
          project_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "_ProjectToSkill_A_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_ProjectToSkill_B_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          companyId: string | null
          created_at: string
          description: string
          experienceId: string | null
          id: string
          image_url: string | null
          link: string | null
          public: boolean
          role: string
          title: string
          updated_at: string
        }
        Insert: {
          companyId?: string | null
          created_at?: string
          description: string
          experienceId?: string | null
          id: string
          image_url?: string | null
          link?: string | null
          public?: boolean
          role: string
          title: string
          updated_at: string
        }
        Update: {
          companyId?: string | null
          created_at?: string
          description?: string
          experienceId?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          public?: boolean
          role?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_companyId_fkey"
            columns: ["companyId"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_experienceId_fkey"
            columns: ["experienceId"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          contact_info: string | null
          created_at: string
          feedback: string | null
          id: string
          name: string | null
          recommendation: string | null
          relationship: string | null
          session_id: string
          updated_at: string
        }
        Insert: {
          contact_info?: string | null
          created_at?: string
          feedback?: string | null
          id: string
          name?: string | null
          recommendation?: string | null
          relationship?: string | null
          session_id: string
          updated_at: string
        }
        Update: {
          contact_info?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          name?: string | null
          recommendation?: string | null
          relationship?: string | null
          session_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          referral_id: string
          state: Database["public"]["Enums"]["ReviewState"]
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id: string
          referral_id: string
          state?: Database["public"]["Enums"]["ReviewState"]
          updated_at: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          referral_id?: string
          state?: Database["public"]["Enums"]["ReviewState"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          created_at: string
          experience_year: string | null
          id: string
          name: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          experience_year?: string | null
          id: string
          name?: string | null
          type: string
          updated_at: string
        }
        Update: {
          created_at?: string
          experience_year?: string | null
          id?: string
          name?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ReviewState: "PENDING" | "APPROVED" | "REJECTED"
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
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
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
