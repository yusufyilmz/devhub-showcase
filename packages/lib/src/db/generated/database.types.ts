export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type PublicationRow = {
  visibility: "public" | "unlisted";
  id: string;
  username: string;
  document: Json;
  revision: number;
  updated_at: string;
};
type PublicationTable = {
  Row: PublicationRow;
  Insert: Omit<PublicationRow, "visibility">;
  Update: Partial<Omit<PublicationRow, "visibility">>;
  Relationships: [];
};

type CompanionFeatureRow = {
  app: "studio" | "fitness";
  feature_id: string;
  category: string;
  title: string;
  message: string;
  context: string | null;
  position: number;
};
type CompanionProgressRow = {
  user_id: string;
  app: CompanionFeatureRow["app"];
  feature_id: string;
  completed_at: string;
};

export interface Database {
  public: {
    Tables: {
      billing_assignments: {
        Row: {
          account_id: string;
          chat_enabled: boolean;
          profile_id: string;
        };
        Insert: {
          account_id: string;
          chat_enabled?: boolean;
          profile_id: string;
        };
        Update: {
          account_id?: string;
          chat_enabled?: boolean;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "billing_assignments_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: true;
            referencedRelation: "billing_entitlements";
            referencedColumns: ["account_id"];
          },
          {
            foreignKeyName: "billing_assignments_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "portfolio_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      billing_customers: {
        Row: {
          account_id: string;
          checkout_id: string | null;
          checkout_key: string;
          customer_id: string | null;
          lease: string | null;
          lease_until: string | null;
        };
        Insert: {
          account_id: string;
          checkout_id?: string | null;
          checkout_key?: string;
          customer_id?: string | null;
          lease?: string | null;
          lease_until?: string | null;
        };
        Update: {
          account_id?: string;
          checkout_id?: string | null;
          checkout_key?: string;
          customer_id?: string | null;
          lease?: string | null;
          lease_until?: string | null;
        };
        Relationships: [];
      };
      billing_entitlements: {
        Row: {
          account_id: string;
          chat_limit: number;
          editor_limit: number;
          period_end: string;
          period_start: string;
          plan: string;
          status: string;
        };
        Insert: {
          account_id: string;
          chat_limit?: number;
          editor_limit?: number;
          period_end: string;
          period_start: string;
          plan?: string;
          status?: string;
        };
        Update: {
          account_id?: string;
          chat_limit?: number;
          editor_limit?: number;
          period_end?: string;
          period_start?: string;
          plan?: string;
          status?: string;
        };
        Relationships: [];
      };
      billing_events: {
        Row: {
          event_id: string;
          processed_at: string;
        };
        Insert: {
          event_id: string;
          processed_at?: string;
        };
        Update: {
          event_id?: string;
          processed_at?: string;
        };
        Relationships: [];
      };
      billing_usage: {
        Row: {
          account_id: string;
          created_at: string;
          feature: string;
          outcome: string;
          period_start: string;
          profile_id: string;
          request_id: string;
        };
        Insert: {
          account_id: string;
          created_at?: string;
          feature: string;
          outcome?: string;
          period_start: string;
          profile_id: string;
          request_id: string;
        };
        Update: {
          account_id?: string;
          created_at?: string;
          feature?: string;
          outcome?: string;
          period_start?: string;
          profile_id?: string;
          request_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "billing_usage_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "billing_entitlements";
            referencedColumns: ["account_id"];
          },
        ];
      };
      companion_features: {
        Row: CompanionFeatureRow;
        Insert: Omit<CompanionFeatureRow, "context"> & { context?: string | null };
        Update: Partial<CompanionFeatureRow>;
        Relationships: [];
      };
      studio_account_preferences: {
        Row: { user_id: string; key: string; value: Json };
        Insert: { user_id: string; key: string; value: Json };
        Update: { user_id?: string; key?: string; value?: Json };
        Relationships: [];
      };
      companion_feature_progress: {
        Row: CompanionProgressRow;
        Insert: Omit<CompanionProgressRow, "completed_at">;
        Update: never;
        Relationships: [];
      };
      portfolio_publications: PublicationTable;
      portfolio_public_cvs: PublicationTable;
      portfolio_profile_history: {
        Row: { profile_id: string; revision: number; document: Json; created_at: string };
        Insert: { profile_id: string; revision: number; document: Json; created_at?: string };
        Update: { document?: Json; created_at?: string };
        Relationships: [];
      };
      portfolio_cv_variants: {
        Row: { owner_id: string; variants: Json; revision: number; updated_at: string };
        Insert: { owner_id: string; variants: Json; revision?: number; updated_at?: string };
        Update: { variants?: Json; revision?: number; updated_at?: string };
        Relationships: [];
      };
      portfolio_section_templates: {
        Row: {
          owner_id: string;
          templates: Json;
          revision: number;
          updated_at: string;
        };
        Insert: {
          owner_id: string;
          templates: Json;
          revision?: number;
          updated_at?: string;
        };
        Update: { templates?: Json; revision?: number; updated_at?: string };
        Relationships: [];
      };

      job_alert_addresses: {
        Row: { user_id: string; token: string };
        Insert: { user_id: string; token?: string };
        Update: { token?: string };
        Relationships: [];
      };
      job_alert_imports: {
        Row: { user_id: string; id: string; listing: Json; received_at: string };
        Insert: { user_id: string; id: string; listing: Json; received_at?: string };
        Update: Record<PropertyKey, never>;
        Relationships: [];
      };
      job_searches: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          filters: Json;
          hours: number;
          threshold: number;
          enabled: boolean;
          due_at: string;
          lease: string | null;
          failures: number;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          filters: Json;
          hours: number;
          threshold: number;
          enabled?: boolean;
          due_at?: string;
          lease?: string | null;
          failures?: number;
        };
        Update: {
          name?: string;
          filters?: Json;
          hours?: number;
          threshold?: number;
          enabled?: boolean;
        };
        Relationships: [];
      };
      job_listings: {
        Row: { user_id: string; id: string; listing: Json };
        Insert: { user_id: string; id: string; listing: Json };
        Update: { listing?: Json };
        Relationships: [];
      };
      job_matches: {
        Row: {
          user_id: string;
          listing_id: string;
          score: number | null;
          cv_revision: number;
          explanation: Json;
          state: string;
          notified_at: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          listing_id: string;
          score: number | null;
          cv_revision: number;
          explanation: Json;
          state?: string;
          notified_at?: string | null;
          created_at?: string;
        };
        Update: { state?: string };
        Relationships: [];
      };
      job_scan_runs: {
        Row: {
          id: string;
          user_id: string;
          search_id: string;
          created_at: string;
          examined: number;
          matched: number;
          issues: string[];
        };
        Insert: {
          id?: string;
          user_id: string;
          search_id: string;
          created_at?: string;
          examined: number;
          matched: number;
          issues: string[];
        };
        Update: Record<PropertyKey, never>;
        Relationships: [];
      };
      job_applications: {
        Row: {
          user_id: string;
          listing_id: string;
          status: string;
          draft: Json | null;
          updated_at: string;
        };
        Insert: {
          user_id?: string;
          listing_id: string;
          status?: string;
          draft?: Json | null;
          updated_at?: string;
        };
        Update: { status?: string; draft?: Json | null };
        Relationships: [];
      };
      job_push_devices: {
        Row: { id: string; user_id: string; subscription: Json };
        Insert: { id: string; user_id: string; subscription: Json };
        Update: { subscription?: Json };
        Relationships: [];
      };
      portfolio_profiles: {
        Row: {
          managed_by: string | null;
          id: string;
          username: string;
          owner_id: string | null;
          document: Json;
          revision: number;
          updated_at: string;
          is_public: boolean;
        };
        Insert: {
          managed_by?: string | null;
          id?: string;
          username?: string;
          owner_id?: string | null;
          document: Json;
          revision?: number;
          updated_at?: string;
          is_public?: boolean;
        };
        Update: {
          username?: string;
          document?: Json;
          revision?: number;
          updated_at?: string;
          is_public?: boolean;
        };
        Relationships: [];
      };

      achievements: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          title: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id: string;
          title?: string | null;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          title?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      certifications: {
        Row: {
          created_at: string;
          date: string;
          hours: string | null;
          id: string;
          name: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          date: string;
          hours?: string | null;
          id: string;
          name?: string | null;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          date?: string;
          hours?: string | null;
          id?: string;
          name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      challenges: {
        Row: {
          created_at: string;
          id: string;
          problem: string | null;
          solution: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          problem?: string | null;
          solution?: string | null;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          problem?: string | null;
          solution?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      characteristics: {
        Row: {
          created_at: string;
          details: string | null;
          id: string;
          name: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          details?: string | null;
          id: string;
          name?: string | null;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          details?: string | null;
          id?: string;
          name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      companies: {
        Row: {
          created_at: string;
          id: string;
          link: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          link: string;
          name: string;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          link?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      educations: {
        Row: {
          created_at: string;
          degree: string;
          description: string | null;
          field_of_study: string;
          finished_at: string | null;
          gpa: string | null;
          id: string;
          institution: string;
          institution_link: string;
          started_at: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          degree: string;
          description?: string | null;
          field_of_study: string;
          finished_at?: string | null;
          gpa?: string | null;
          id: string;
          institution: string;
          institution_link: string;
          started_at: string;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          degree?: string;
          description?: string | null;
          field_of_study?: string;
          finished_at?: string | null;
          gpa?: string | null;
          id?: string;
          institution?: string;
          institution_link?: string;
          started_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      experiences: {
        Row: {
          achievements: string[] | null;
          companyId: string | null;
          created_at: string;
          finished_at: string | null;
          id: string;
          role: string;
          started_at: string;
          updated_at: string;
        };
        Insert: {
          achievements?: string[] | null;
          companyId?: string | null;
          created_at?: string;
          finished_at?: string | null;
          id: string;
          role: string;
          started_at: string;
          updated_at: string;
        };
        Update: {
          achievements?: string[] | null;
          companyId?: string | null;
          created_at?: string;
          finished_at?: string | null;
          id?: string;
          role?: string;
          started_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "experiences_companyId_fkey";
            columns: ["companyId"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      languages: {
        Row: {
          created_at: string;
          id: string;
          name: string | null;
          proficiency: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          name?: string | null;
          proficiency?: string | null;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string | null;
          proficiency?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_skills: {
        Row: {
          project_id: string;
          skill_id: string;
        };
        Insert: {
          project_id: string;
          skill_id: string;
        };
        Update: {
          project_id?: string;
          skill_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "_ProjectToSkill_A_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "_ProjectToSkill_B_fkey";
            columns: ["skill_id"];
            isOneToOne: false;
            referencedRelation: "skills";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          companyId: string | null;
          created_at: string;
          description: string;
          experienceId: string | null;
          id: string;
          image_url: string | null;
          link: string | null;
          public: boolean;
          role: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          companyId?: string | null;
          created_at?: string;
          description: string;
          experienceId?: string | null;
          id: string;
          image_url?: string | null;
          link?: string | null;
          public?: boolean;
          role: string;
          title: string;
          updated_at: string;
        };
        Update: {
          companyId?: string | null;
          created_at?: string;
          description?: string;
          experienceId?: string | null;
          id?: string;
          image_url?: string | null;
          link?: string | null;
          public?: boolean;
          role?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_companyId_fkey";
            columns: ["companyId"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "projects_experienceId_fkey";
            columns: ["experienceId"];
            isOneToOne: false;
            referencedRelation: "experiences";
            referencedColumns: ["id"];
          },
        ];
      };
      referrals: {
        Row: {
          contact_info: string | null;
          created_at: string;
          feedback: string | null;
          id: string;
          name: string | null;
          recommendation: string | null;
          relationship: string | null;
          session_id: string;
          updated_at: string;
        };
        Insert: {
          contact_info?: string | null;
          created_at?: string;
          feedback?: string | null;
          id?: string;
          name?: string | null;
          recommendation?: string | null;
          relationship?: string | null;
          session_id: string;
          updated_at: string;
        };
        Update: {
          contact_info?: string | null;
          created_at?: string;
          feedback?: string | null;
          id?: string;
          name?: string | null;
          recommendation?: string | null;
          relationship?: string | null;
          session_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          comment: string | null;
          created_at: string;
          id: string;
          referral_id: string;
          state: Database["public"]["Enums"]["ReviewState"];
          updated_at: string;
        };
        Insert: {
          comment?: string | null;
          created_at?: string;
          id: string;
          referral_id: string;
          state?: Database["public"]["Enums"]["ReviewState"];
          updated_at: string;
        };
        Update: {
          comment?: string | null;
          created_at?: string;
          id?: string;
          referral_id?: string;
          state?: Database["public"]["Enums"]["ReviewState"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_referral_id_fkey";
            columns: ["referral_id"];
            isOneToOne: false;
            referencedRelation: "referrals";
            referencedColumns: ["id"];
          },
        ];
      };
      skills: {
        Row: {
          created_at: string;
          experience_year: string | null;
          id: string;
          name: string | null;
          type: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          experience_year?: string | null;
          id: string;
          name?: string | null;
          type: string;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          experience_year?: string | null;
          id?: string;
          name?: string | null;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      enqueue_linkedin_alert: {
        Args: { address_token: string; verified_sender: string; candidates: Json };
        Returns: number;
      };
      accept_linkedin_alert: {
        Args: { account_id: string; import_id: string; reviewed_listing: Json; match_score: number | null; cv_version: number; match_explanation: Json };
        Returns: boolean;
      };
      reserve_job_provider_request: {
        Args: { source: string; country: string; daily_limit: number };
        Returns: boolean;
      };
      claim_job_search: {
        Args: Record<PropertyKey, never>;
        Returns: Database["public"]["Tables"]["job_searches"]["Row"][];
      };
      finish_job_search: {
        Args: {
          search: string;
          claim: string;
          results: Json;
          examined_count: number;
          issues_found: string[];
          should_retry: boolean;
        };
        Returns: boolean;
      };
      claim_job_push: {
        Args: { batch_size: number };
        Returns: { id: string; lease: string; attempt: number; subscription: Json }[];
      };
      finish_job_push: {
        Args: { delivery_id: string; claim: string; outcome: string };
        Returns: undefined;
      };
      claim_billing: {
        Args: { p_account: string; p_lease: string };
        Returns: boolean;
      };
      commit_billing: {
        Args: {
          p_account: string;
          p_event: string;
          p_lease: string;
          p_state: Json;
        };
        Returns: boolean;
      };
      reserve_premium_usage: {
        Args: {
          p_account: string;
          p_feature: string;
          p_profile: string;
          p_request: string;
        };
        Returns: boolean;
      };
      resolve_published_username: {
        Args: { requested_username: string };
        Returns: Array<{ id: string; username: string }>;
      };
      portfolio_access_status: { Args: { requested_username: string }; Returns: Json };
      portfolio_password_record: { Args: { profile_id: string }; Returns: Json };
      read_protected_publication: {
        Args: { profile_id: string; access_version: string; surface: string };
        Returns: Json;
      };
      reserve_portfolio_access_attempt: { Args: { request_bucket: string }; Returns: boolean };
      publish_portfolio_with_password: {
        Args: { profile_id: string; expected_revision: number; password_digest: string };
        Returns: number;
      };
      portfolio_schedule_status: { Args: { profile_id: string }; Returns: Json };
      schedule_portfolio_publication: {
        Args: { profile_id: string; expected_revision: number; run_at: string; timezone: string };
        Returns: string;
      };
      cancel_portfolio_schedule: {
        Args: { profile_id: string; schedule_id: string };
        Returns: boolean;
      };
      execute_portfolio_schedules: { Args: Record<string, never>; Returns: number };
      set_portfolio_publication: {
        Args: { profile_id: string; expected_revision: number; publish: boolean };
        Returns: number;
      };
      is_portfolio_admin: { Args: Record<string, never>; Returns: boolean };
      transfer_managed_portfolio: {
        Args: {
          profile_id: string;
          target_email: string;
          expected_revision: number;
        };
        Returns: Json;
      };
    };
    Enums: {
      ReviewState: "PENDING" | "APPROVED" | "REJECTED";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
