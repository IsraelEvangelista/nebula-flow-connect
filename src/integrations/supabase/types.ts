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
      Cadastro_Nebula: {
        Row: {
          email: string
          id: number
          senha: string | null
          telefone: string
          usuario: string
          webhook: string
        }
        Insert: {
          email: string
          id?: number
          senha?: string | null
          telefone: string
          usuario: string
          webhook: string
        }
        Update: {
          email?: string
          id?: number
          senha?: string | null
          telefone?: string
          usuario?: string
          webhook?: string
        }
        Relationships: []
      }
      cogerh_rag: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      dados_monitoramento: {
        Row: {
          created_at: string | null
          data_coleta: string
          id: string
          observacao: string | null
          subgrupo_id: string
          tipo_dado_id: string
          usuario_id: string
          valor_numerico: number | null
          valor_texto: string | null
        }
        Insert: {
          created_at?: string | null
          data_coleta: string
          id?: string
          observacao?: string | null
          subgrupo_id: string
          tipo_dado_id: string
          usuario_id: string
          valor_numerico?: number | null
          valor_texto?: string | null
        }
        Update: {
          created_at?: string | null
          data_coleta?: string
          id?: string
          observacao?: string | null
          subgrupo_id?: string
          tipo_dado_id?: string
          usuario_id?: string
          valor_numerico?: number | null
          valor_texto?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dados_monitoramento_subgrupo_id_fkey"
            columns: ["subgrupo_id"]
            isOneToOne: false
            referencedRelation: "subgrupos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dados_monitoramento_tipo_dado_id_fkey"
            columns: ["tipo_dado_id"]
            isOneToOne: false
            referencedRelation: "tipos_dados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dados_monitoramento_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      grupo_tipos_dados: {
        Row: {
          created_at: string | null
          grupo_id: string
          id: string
          obrigatorio: boolean | null
          tipo_dado_id: string
        }
        Insert: {
          created_at?: string | null
          grupo_id: string
          id?: string
          obrigatorio?: boolean | null
          tipo_dado_id: string
        }
        Update: {
          created_at?: string | null
          grupo_id?: string
          id?: string
          obrigatorio?: boolean | null
          tipo_dado_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grupo_tipos_dados_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grupo_tipos_dados_tipo_dado_id_fkey"
            columns: ["tipo_dado_id"]
            isOneToOne: false
            referencedRelation: "tipos_dados"
            referencedColumns: ["id"]
          },
        ]
      }
      grupos: {
        Row: {
          created_at: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      perfis: {
        Row: {
          created_at: string | null
          id: string
          nome: string
          tipo: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
          tipo: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
          tipo?: string
        }
        Relationships: []
      }
      permissoes: {
        Row: {
          created_at: string | null
          grupo_id: string
          id: string
          perfil_id: string
          pode_editar: boolean | null
          pode_inserir: boolean | null
          pode_visualizar: boolean | null
        }
        Insert: {
          created_at?: string | null
          grupo_id: string
          id?: string
          perfil_id: string
          pode_editar?: boolean | null
          pode_inserir?: boolean | null
          pode_visualizar?: boolean | null
        }
        Update: {
          created_at?: string | null
          grupo_id?: string
          id?: string
          perfil_id?: string
          pode_editar?: boolean | null
          pode_inserir?: boolean | null
          pode_visualizar?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "permissoes_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permissoes_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      subgrupos: {
        Row: {
          created_at: string | null
          grupo_id: string
          id: string
          nome: string
        }
        Insert: {
          created_at?: string | null
          grupo_id: string
          id?: string
          nome: string
        }
        Update: {
          created_at?: string | null
          grupo_id?: string
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "subgrupos_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_dados: {
        Row: {
          created_at: string | null
          id: string
          nome: string
          unidade: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
          unidade?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
          unidade?: string | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          ativo: boolean
          created_at: string | null
          email: string
          id: string
          nome: string
          perfil_id: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string | null
          email: string
          id: string
          nome: string
          perfil_id: string
        }
        Update: {
          ativo?: boolean
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          perfil_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      "Vendas de Supermercado": {
        Row: {
          Branch: string | null
          City: string | null
          COGS: number | null
          "Customer type": string | null
          Date: string | null
          Gender: string | null
          "Gross income": number | null
          "Gross margin percentage": number | null
          "Invoice ID": string
          Payment: string | null
          "Product line": string | null
          Quantity: number | null
          Rating: number | null
          "Tax 5%": number | null
          Time: string | null
          Total: number | null
          "Unit price": number | null
        }
        Insert: {
          Branch?: string | null
          City?: string | null
          COGS?: number | null
          "Customer type"?: string | null
          Date?: string | null
          Gender?: string | null
          "Gross income"?: number | null
          "Gross margin percentage"?: number | null
          "Invoice ID": string
          Payment?: string | null
          "Product line"?: string | null
          Quantity?: number | null
          Rating?: number | null
          "Tax 5%"?: number | null
          Time?: string | null
          Total?: number | null
          "Unit price"?: number | null
        }
        Update: {
          Branch?: string | null
          City?: string | null
          COGS?: number | null
          "Customer type"?: string | null
          Date?: string | null
          Gender?: string | null
          "Gross income"?: number | null
          "Gross margin percentage"?: number | null
          "Invoice ID"?: string
          Payment?: string | null
          "Product line"?: string | null
          Quantity?: number | null
          Rating?: number | null
          "Tax 5%"?: number | null
          Time?: string | null
          Total?: number | null
          "Unit price"?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
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
