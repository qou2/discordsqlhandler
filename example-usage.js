const { createClient } = require('@supabase/supabase-js');
const SQLHandler = require('./sqlHandler');

const ADMIN_IDS = ["discord_id_here"];

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sqlHandler = new SQLHandler(supabase);

async function handleMessage(message) {
    if (message.content.startsWith('.sql ')) {
        if (!ADMIN_IDS.includes(message.author.id)) {
            await message.reply('Access Denied - Admin only');
            return;
        }

        const query = message.content.substring(5).trim();

        if (!query) {
            await message.reply('Please provide a SQL query');
            return;
        }

        const result = await sqlHandler.execute(query);
        await message.reply(result.message);
    }
}
