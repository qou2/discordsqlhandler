class SQLHandler {
    constructor(supabase) {
        this.supabase = supabase;
    }

    async execute(query) {
        const startTime = Date.now();
        
        try {
            query = query.replace(/;$/, '').trim();
            const isSelect = query.toLowerCase().startsWith('select');
            const isUpdate = query.toLowerCase().startsWith('update');
            const isInsert = query.toLowerCase().startsWith('insert');
            const isDelete = query.toLowerCase().startsWith('delete');

            if (isSelect) {
                return await this.executeSelect(query, startTime);
            } else if (isUpdate || isInsert || isDelete) {
                return await this.executeMutation(query, startTime);
            } else {
                return {
                    success: false,
                    message: 'Unsupported query type. Use SELECT, UPDATE, INSERT, or DELETE.',
                    executionTime: Date.now() - startTime
                };
            }
        } catch (error) {
            return {
                success: false,
                message: `Error: ${error.message}`,
                executionTime: Date.now() - startTime
            };
        }
    }

    async executeSelect(query, startTime) {
        const { data, error } = await this.supabase.rpc('exec_sql_select', { sql: query });
        const executionTime = Date.now() - startTime;

        if (error) {
            return {
                success: false,
                message: `Error (${executionTime}ms): ${error.message}`,
                executionTime
            };
        }

        if (!data || data.length === 0) {
            return {
                success: true,
                message: `Query Success (${executionTime}ms) - No results`,
                executionTime
            };
        }

        const resultStr = JSON.stringify(data, null, 2);
        const truncated = resultStr.length > 1900;
        const displayStr = truncated ? resultStr.substring(0, 1850) + '...' : resultStr;

        return {
            success: true,
            message: `Query Success (${executionTime}ms) - ${data.length} row(s):\n\`\`\`json\n${displayStr}\n\`\`\``,
            executionTime,
            data
        };
    }
    async executeMutation(query, startTime) {
        const { error: writeError } = await this.supabase.rpc('exec_sql_write', { sql: query });
        if (writeError) {
            const executionTime = Date.now() - startTime;
            return {
                success: false,
                message: `Error (${executionTime}ms): ${writeError.message}`,
                executionTime
            };
        }
        const whereMatch = query.match(/WHERE\s+(.+?)(?:RETURNING|$)/i);        
        if (whereMatch) {
            const tableMatch = query.match(/(?:UPDATE|DELETE FROM|INSERT INTO)\s+(\S+)/i);
            
            if (tableMatch) {
                const tableName = tableMatch[1];
                const whereClause = whereMatch[1].trim();
                const selectQuery = `SELECT * FROM ${tableName} WHERE ${whereClause}`;
                
                const { data } = await this.supabase.rpc('exec_sql_select', { sql: selectQuery });
                const executionTime = Date.now() - startTime;
                
                if (data && data.length > 0) {
                    const resultStr = JSON.stringify(data, null, 2);
                    const truncated = resultStr.length > 1900;
                    const displayStr = truncated ? resultStr.substring(0, 1850) + '...' : resultStr;

                    return {
                        success: true,
                        message: `Update Success (${executionTime}ms) — ${data.length} row(s) affected:\n\`\`\`json\n${displayStr}\n\`\`\``,
                        executionTime,
                        data
                    };
                }
            }
        }

        const executionTime = Date.now() - startTime;
        return {
            success: true,
            message: `Update Success (${executionTime}ms)`,
            executionTime
        };
    }
}

module.exports = SQLHandler;
