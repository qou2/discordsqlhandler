# Discord Supabase SQL Handler

![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-internal%20tool-orange)
![Security](https://img.shields.io/badge/access-admin%20only-red)

A lightweight SQL execution handler designed for **admin-only Discord bot usage** with Supabase.

This module allows controlled execution of:

- `SELECT`
- `INSERT`
- `UPDATE`
- `DELETE`

queries via Supabase RPC functions.

---

## ⚠️ Warning

This handler executes **raw SQL**.

You MUST:

- Restrict usage to trusted admin Discord IDs
- Use the Supabase **Service Role Key**
- Never expose this to public commands or frontend users
- Never deploy without access control

This is intended strictly for **internal tooling**.

---

## Features

- Automatic query type detection
- Execution time measurement
- JSON formatted response output
- Discord-safe message length truncation
- Auto-fetch affected rows after `UPDATE` / `DELETE` (if `WHERE` clause exists)
- Structured return format
- Zero external dependencies

---

## Return Format

Every execution returns:

```js
{
  success: boolean,
  message: string,
  executionTime: number,
  data?: any[]
}
```

### Example Success Output

```
Query Success (52ms) - 3 row(s):
```

```json
[
  {
    "id": 1,
    "username": "example"
  }
]
```

---

## ✅ Supported Query Types

| Query Type | Supported |
|------------|-----------|
| SELECT     | ✅ |
| INSERT     | ✅ |
| UPDATE     | ✅ |
| DELETE     | ✅ |
| DROP       | ❌ |
| ALTER      | ❌ |

Only basic CRUD operations are supported by design.

---

## ❌ Not Recommended For

- Public APIs
- User-submitted queries
- Frontend exposure
- Production apps without strict access control

---

## 📄 License

MIT License
