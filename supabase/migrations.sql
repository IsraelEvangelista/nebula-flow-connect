
-- Create perfis table needed by is_admin function
CREATE TABLE IF NOT EXISTS public.perfis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Insert default admin profile
INSERT INTO public.perfis (nome) 
VALUES ('Administrador') 
ON CONFLICT DO NOTHING;

-- Create documents table needed by match_documents function
CREATE TABLE IF NOT EXISTS public.documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding VECTOR(1536)
);

-- Fix is_admin function to use the search_path parameter
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.usuarios u
    JOIN public.perfis p ON u.perfil_id = p.id
    WHERE u.id = auth.uid() AND p.nome = 'Administrador'
  );
END;
$function$;

-- Fix match_documents function to use the search_path parameter
CREATE OR REPLACE FUNCTION public.match_documents(query_embedding vector, match_count integer DEFAULT NULL::integer, filter jsonb DEFAULT '{}'::jsonb)
RETURNS TABLE(id bigint, content text, metadata jsonb, similarity double precision)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$function$;
