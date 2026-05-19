interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * LeetCode MCP.
 */


const ENDPOINT = 'https://leetcode.com/graphql';
const UA = 'pipeworx-mcp-leetcode/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'user_profile', description: 'Public profile.', inputSchema: { type: 'object', properties: { username: { type: 'string' } }, required: ['username'] } },
  { name: 'user_solved', description: 'Solved counts by difficulty.', inputSchema: { type: 'object', properties: { username: { type: 'string' } }, required: ['username'] } },
  { name: 'user_recent_submissions', description: 'Recent accepted submissions.', inputSchema: { type: 'object', properties: { username: { type: 'string' }, limit: { type: 'number' } }, required: ['username'] } },
  { name: 'daily_question', description: "Today's daily coding challenge.", inputSchema: { type: 'object', properties: {} } },
  { name: 'problem', description: 'Problem detail by slug.', inputSchema: { type: 'object', properties: { title_slug: { type: 'string' } }, required: ['title_slug'] } },
  { name: 'problemset_stats', description: 'Total problems by difficulty.', inputSchema: { type: 'object', properties: {} } },
];

const Q = {
  profile: `query userPublicProfile($username: String!) { matchedUser(username: $username) { username profile { realName aboutMe userAvatar ranking countryName company school websites starRating } } }`,
  solved: `query userSolved($username: String!) { matchedUser(username: $username) { submitStats { acSubmissionNum { difficulty count submissions } totalSubmissionNum { difficulty count submissions } } } }`,
  recent: `query recentAcSubmissions($username: String!, $limit: Int!) { recentAcSubmissionList(username: $username, limit: $limit) { id title titleSlug timestamp } }`,
  daily: `query questionOfToday { activeDailyCodingChallengeQuestion { date link question { questionId titleSlug title difficulty topicTags { name slug } } } }`,
  problem: `query selectProblem($titleSlug: String!) { question(titleSlug: $titleSlug) { questionId title titleSlug content difficulty likes dislikes isPaidOnly stats topicTags { name slug } } }`,
  stats: `query problemsetStats { allQuestionsCount { difficulty count } }`,
} as const;

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const post = async (query: string, variables: Record<string, unknown>) => {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': UA, Referer: 'https://leetcode.com/' },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) throw new Error(`LeetCode: ${res.status}`);
    const j = (await res.json()) as { data?: unknown; errors?: unknown };
    if (j.errors) throw new Error(`LeetCode GraphQL: ${JSON.stringify(j.errors)}`);
    return j.data;
  };
  switch (name) {
    case 'user_profile':
      return post(Q.profile, { username: reqStr(args, 'username', '"leetcoder"') });
    case 'user_solved':
      return post(Q.solved, { username: reqStr(args, 'username', '"leetcoder"') });
    case 'user_recent_submissions':
      return post(Q.recent, { username: reqStr(args, 'username', '"leetcoder"'), limit: Number(args.limit ?? 15) });
    case 'daily_question':
      return post(Q.daily, {});
    case 'problem':
      return post(Q.problem, { titleSlug: reqStr(args, 'title_slug', '"two-sum"') });
    case 'problemset_stats':
      return post(Q.stats, {});
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
