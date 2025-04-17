
-- Helper function to execute arbitrary SQL with service role
-- This is needed to bypass RLS completely in some edge cases
CREATE OR REPLACE FUNCTION public.execute_sql(query TEXT, params JSONB DEFAULT '[]'::jsonb)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  prepared_statement TEXT;
  i INT;
BEGIN
  -- Generate a random prepared statement name to avoid conflicts
  prepared_statement := 'stmt_' || floor(random() * 1000000)::TEXT;
  
  -- Create the prepared statement
  EXECUTE 'PREPARE ' || prepared_statement || ' AS ' || query;
  
  -- Execute the prepared statement with parameters
  EXECUTE 'EXECUTE ' || prepared_statement INTO result USING params;
  
  -- Deallocate the prepared statement
  EXECUTE 'DEALLOCATE ' || prepared_statement;
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  -- Clean up on error
  BEGIN
    EXECUTE 'DEALLOCATE IF EXISTS ' || prepared_statement;
  EXCEPTION WHEN OTHERS THEN
    -- Ignore errors in cleanup
  END;
  
  RAISE;
END;
$$;

-- Set proper permissions
REVOKE ALL ON FUNCTION public.execute_sql FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.execute_sql TO service_role;
