

export async function GET() {
  const groqKey = process.env.GROQ_API_KEY || '';
  const firecrawlKey = process.env.FIRECRAWL_API_KEY || '';
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || '';
  
  const diagnostics = {
    groq: {
      present: !!groqKey,
      length: groqKey.length,
      prefix: groqKey.substring(0, 4),
      suffix: groqKey.substring(groqKey.length - 4),
      hasQuotes: groqKey.startsWith('"') || groqKey.endsWith('"') || groqKey.startsWith("'") || groqKey.endsWith("'"),
      hasWhitespace: groqKey.trim() !== groqKey
    },
    firecrawl: {
      present: !!firecrawlKey,
      length: firecrawlKey.length,
      prefix: firecrawlKey.substring(0, 4),
      suffix: firecrawlKey.substring(firecrawlKey.length - 4),
      isPlaceholder: firecrawlKey === 'your_firecrawl_api_key_here'
    },
    redis: {
      present: !!redisUrl,
      isPlaceholder: redisUrl === 'your_upstash_redis_rest_url_here'
    }
  };

  return new Response(JSON.stringify(diagnostics, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
}
