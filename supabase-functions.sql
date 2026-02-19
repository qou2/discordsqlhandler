-- SELECT executor
create or replace function exec_sql_select(sql text)
returns json
language plpgsql
security definer
as $$
declare
    result json;
begin
    execute format('select json_agg(t) from (%s) t', sql) into result;
    return coalesce(result, '[]'::json);
end;
$$;

-- WRITE executor
create or replace function exec_sql_write(sql text)
returns void
language plpgsql
security definer
as $$
begin
    execute sql;
end;
$$;
