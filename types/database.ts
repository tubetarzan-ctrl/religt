// Hand-written types matching supabase/migrations/*.sql.
// Once a live Supabase project exists, regenerate with:
//   npx supabase gen types typescript --project-id <id> > types/database.ts
// and reconcile with the domain helper types in types/domain.ts.

export type Role =
  | "super_admin"
  | "admin"
  | "accountant"
  | "sales_staff"
  | "guide"
  | "staff"
  | "customer";

export type Vertical =
  | "iraq_ziarat"
  | "iran_ziarat"
  | "umrah"
  | "air_ticket"
  | "visa"
  | "sunni_group";

export type Sect = "sunni" | "shia" | "general";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: Role;
          phone: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      tour_events: {
        Row: {
          id: string;
          vertical: Vertical;
          sect: Sect;
          combined_group_id: string | null;
          title: string;
          slug: string;
          start_date: string;
          end_date: string;
          duration_days: number | null;
          capacity: number;
          seats_booked: number;
          waitlist_count: number;
          price_amount: number;
          price_single_sharing: number | null;
          price_triple_sharing: number | null;
          price_quad_sharing: number | null;
          price_iraq_leg_only: number | null;
          price_umrah_leg_only: number | null;
          currency: string;
          early_bird_price: number | null;
          early_bird_deadline: string | null;
          guide_name: string | null;
          guide_bio: string | null;
          poster_image_url: string | null;
          featured: boolean;
          status: "upcoming" | "past";
          itinerary: unknown;
          hotels: unknown;
          document_checklist: unknown;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["tour_events"]["Row"]> & {
          vertical: Vertical;
          title: string;
          slug: string;
          start_date: string;
          end_date: string;
          price_amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["tour_events"]["Row"]>;
      };
      bookings: {
        Row: {
          id: string;
          customer_id: string | null;
          tour_event_id: string | null;
          vertical: string | null;
          agent_id: string | null;
          pax_count: number;
          total_amount: number;
          payment_plan: "full" | "2_installment" | "3_installment";
          status: "inquiry" | "quoted" | "confirmed" | "paid" | "completed" | "cancelled";
          cancelled_at: string | null;
          cancellation_reason: string | null;
          refund_amount: number | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["bookings"]["Row"]> & {
          total_amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Row"]>;
      };
      travelers: {
        Row: {
          id: string;
          booking_id: string | null;
          full_name: string;
          passport_number: string | null;
          passport_expiry: string | null;
          date_of_birth: string | null;
          gender: string | null;
          room_sharing_pref: "single" | "double" | "triple" | "quad" | null;
          room_number: string | null;
          medical_notes: string | null;
          emergency_contact: unknown;
          documents_submitted: unknown;
          visa_status: "not_started" | "submitted" | "approved" | "rejected";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["travelers"]["Row"]> & { full_name: string };
        Update: Partial<Database["public"]["Tables"]["travelers"]["Row"]>;
      };
      payment_submissions: {
        Row: {
          id: string;
          booking_id: string | null;
          proof_url: string;
          claimed_amount: number | null;
          bank_account_used: string | null;
          status: "pending" | "verified" | "rejected";
          reviewed_by: string | null;
          rejection_reason: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payment_submissions"]["Row"]> & {
          proof_url: string;
        };
        Update: Partial<Database["public"]["Tables"]["payment_submissions"]["Row"]>;
      };
      reviews: {
        Row: {
          id: string;
          landing_page_slug: string;
          tour_event_id: string | null;
          customer_id: string | null;
          customer_name: string | null;
          customer_phone: string | null;
          rating: number | null;
          text_content: string | null;
          image_urls: string[];
          video_status: "none" | "uploading" | "processing" | "ready" | "failed";
          youtube_video_id: string | null;
          source: "admin_added" | "customer_submitted";
          moderation_status: "auto_published" | "pending_review" | "rejected";
          published: boolean;
          admin_reply: string | null;
          admin_reply_at: string | null;
          google_review_prompted: boolean;
          google_review_clicked: boolean;
          flagged_reason: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reviews"]["Row"]> & {
          landing_page_slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
      };
      gallery_images: {
        Row: {
          id: string;
          landing_page_slug: string | null;
          category: "hotel" | "shrine" | "group_photo" | null;
          image_url: string | null;
          media_type: "image" | "youtube";
          youtube_video_id: string | null;
          visible: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["gallery_images"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["gallery_images"]["Row"]>;
      };
      inquiries: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          phone: string | null;
          vertical: string | null;
          message: string | null;
          source: "form" | "whatsapp" | "email" | null;
          assigned_to: string | null;
          status: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["inquiries"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["inquiries"]["Row"]>;
      };
      chart_of_accounts: {
        Row: {
          id: string;
          code: string;
          name: string;
          type: "asset" | "liability" | "equity" | "revenue" | "expense";
          subtype: string | null;
          normal_balance: "debit" | "credit";
          parent_id: string | null;
          vertical: string | null;
          is_active: boolean;
          is_system: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["chart_of_accounts"]["Row"]> & {
          code: string;
          name: string;
          type: "asset" | "liability" | "equity" | "revenue" | "expense";
          normal_balance: "debit" | "credit";
        };
        Update: Partial<Database["public"]["Tables"]["chart_of_accounts"]["Row"]>;
      };
      journal_entries: {
        Row: {
          id: string;
          entry_date: string;
          reference: string | null;
          memo: string | null;
          tour_event_id: string | null;
          source: string;
          reversed_entry_id: string | null;
          created_by: string | null;
          posted: boolean;
          period_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["journal_entries"]["Row"]> & {
          entry_date: string;
        };
        Update: Partial<Database["public"]["Tables"]["journal_entries"]["Row"]>;
      };
      journal_lines: {
        Row: {
          id: string;
          journal_entry_id: string | null;
          account_id: string | null;
          vendor_id: string | null;
          customer_id: string | null;
          debit: number;
          credit: number;
          memo: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["journal_lines"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["journal_lines"]["Row"]>;
      };
      vendors: {
        Row: {
          id: string;
          name: string;
          category: "hotel" | "airline" | "ground_transport" | "visa_processor" | "other" | null;
          default_payable_account_id: string | null;
          contact_info: unknown;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["vendors"]["Row"]> & { name: string };
        Update: Partial<Database["public"]["Tables"]["vendors"]["Row"]>;
      };
      accounting_periods: {
        Row: {
          id: string;
          period_type: "month" | "quarter" | "year";
          start_date: string;
          end_date: string;
          status: "open" | "closed";
          closed_by: string | null;
          closed_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["accounting_periods"]["Row"]> & {
          period_type: "month" | "quarter" | "year";
          start_date: string;
          end_date: string;
        };
        Update: Partial<Database["public"]["Tables"]["accounting_periods"]["Row"]>;
      };
      fixed_assets: {
        Row: {
          id: string;
          name: string;
          purchase_date: string;
          cost: number;
          useful_life_months: number;
          salvage_value: number;
          asset_account_id: string | null;
          accum_depreciation_account_id: string | null;
          disposed: boolean;
          disposed_date: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["fixed_assets"]["Row"]> & {
          name: string;
          purchase_date: string;
          cost: number;
          useful_life_months: number;
        };
        Update: Partial<Database["public"]["Tables"]["fixed_assets"]["Row"]>;
      };
      chatbot_knowledge: {
        Row: {
          id: string;
          question_pattern: string;
          answer: string;
          vertical: string | null;
          hit_count: number;
          created_at: string;
          tour_event_id: string | null;
          source: "manual" | "tour_event_sync" | "ai_cache";
          normalized_question: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["chatbot_knowledge"]["Row"]> & {
          question_pattern: string;
          answer: string;
        };
        Update: Partial<Database["public"]["Tables"]["chatbot_knowledge"]["Row"]>;
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          cover_image_url: string | null;
          vertical: string | null;
          published: boolean;
          published_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["blog_posts"]["Row"]> & {
          slug: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
