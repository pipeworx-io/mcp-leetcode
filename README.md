# @pipeworx/leetcode

LeetCode MCP — public profile + problem lookups via the keyless GraphQL endpoint at `leetcode.com/graphql`.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `user_profile(username)` — public profile (real name, avatar, ranking, contest rating)
- `user_solved(username)` — solved-problem stats by difficulty
- `user_recent_submissions(username, limit?)` — recent accepted submissions
- `daily_question()` — today's daily coding challenge
- `problem(title_slug)` — problem detail by slug (e.g. "two-sum")
- `problemset_stats()` — total problems by difficulty

## Notes

Uses LeetCode's public GraphQL endpoint — unofficial, may change without notice.

## Data source

`https://leetcode.com/graphql`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "leetcode": {
      "url": "https://gateway.pipeworx.io/leetcode/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Leetcode data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
