export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "customer" | "staff" | "admin";
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "customer" | "staff" | "admin";
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: "customer" | "staff" | "admin";
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          type: "room" | "problem" | "product_type";
          parent_id: string | null;
          icon_name: string | null;
          display_order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          type: "room" | "problem" | "product_type";
          parent_id?: string | null;
          icon_name?: string | null;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          type?: "room" | "problem" | "product_type";
          parent_id?: string | null;
          icon_name?: string | null;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          description: string | null;
          category_id: string;
          is_published: boolean;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          category_id: string;
          is_published?: boolean;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          subtitle?: string | null;
          description?: string | null;
          category_id?: string;
          is_published?: boolean;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          title: string;
          price_vnd: number;
          compare_at_price_vnd: number | null;
          width_mm: number;
          depth_mm: number;
          height_mm: number;
          weight_kg: number | null;
          max_load_kg: number | null;
          no_drill_flag: boolean;
          material: string;
          color: string;
          stock_available: number;
          stock_reserved: number;
          low_stock_threshold: number;
          image_url: string;
          model_3d_url: string | null;
          fit_score_explanation: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          title: string;
          price_vnd: number;
          compare_at_price_vnd?: number | null;
          width_mm: number;
          depth_mm: number;
          height_mm: number;
          weight_kg?: number | null;
          max_load_kg?: number | null;
          no_drill_flag?: boolean;
          material: string;
          color: string;
          stock_available?: number;
          stock_reserved?: number;
          low_stock_threshold?: number;
          image_url: string;
          model_3d_url?: string | null;
          fit_score_explanation?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          sku?: string;
          title?: string;
          price_vnd?: number;
          compare_at_price_vnd?: number | null;
          width_mm?: number;
          depth_mm?: number;
          height_mm?: number;
          weight_kg?: number | null;
          max_load_kg?: number | null;
          no_drill_flag?: boolean;
          material?: string;
          color?: string;
          stock_available?: number;
          stock_reserved?: number;
          low_stock_threshold?: number;
          image_url?: string;
          model_3d_url?: string | null;
          fit_score_explanation?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: string;
          status: "draft" | "placed" | "processing" | "shipped" | "delivered" | "cancelled";
          subtotal_vnd: number;
          discount_vnd: number;
          shipping_vnd: number;
          total_amount_vnd: number;
          applied_promotion_code: string | null;
          idempotency_key: string;
          notes: string | null;
          is_demo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: string;
          status?: "draft" | "placed" | "processing" | "shipped" | "delivered" | "cancelled";
          subtotal_vnd: number;
          discount_vnd?: number;
          shipping_vnd?: number;
          total_amount_vnd: number;
          applied_promotion_code?: string | null;
          idempotency_key: string;
          notes?: string | null;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          shipping_address?: string;
          status?: "draft" | "placed" | "processing" | "shipped" | "delivered" | "cancelled";
          subtotal_vnd?: number;
          discount_vnd?: number;
          shipping_vnd?: number;
          total_amount_vnd?: number;
          applied_promotion_code?: string | null;
          idempotency_key?: string;
          notes?: string | null;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          variant_id: string;
          sku: string;
          title_snapshot: string;
          dimensions_snapshot: string;
          unit_price_vnd: number;
          quantity: number;
          line_total_vnd: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          variant_id: string;
          sku: string;
          title_snapshot: string;
          dimensions_snapshot: string;
          unit_price_vnd: number;
          quantity: number;
          line_total_vnd: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          variant_id?: string;
          sku?: string;
          title_snapshot?: string;
          dimensions_snapshot?: string;
          unit_price_vnd?: number;
          quantity?: number;
          line_total_vnd?: number;
          created_at?: string;
        };
      };
      promotions: {
        Row: {
          id: string;
          code: string;
          description: string | null;
          discount_percent: number;
          max_discount_vnd: number | null;
          min_order_amount_vnd: number;
          starts_at: string;
          expires_at: string | null;
          usage_limit: number | null;
          times_used: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          description?: string | null;
          discount_percent: number;
          max_discount_vnd?: number | null;
          min_order_amount_vnd?: number;
          starts_at?: string;
          expires_at?: string | null;
          usage_limit?: number | null;
          times_used?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          description?: string | null;
          discount_percent?: number;
          max_discount_vnd?: number | null;
          min_order_amount_vnd?: number;
          starts_at?: string;
          expires_at?: string | null;
          usage_limit?: number | null;
          times_used?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
