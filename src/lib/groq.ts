import OpenAI from 'openai';

// Groq uses the OpenAI-compatible SDK format.
export const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1'
});

export const SYSTEM_PROMPT = `You are a senior competitive intelligence analyst. Be specific, data-driven, and avoid vague platitudes. Every insight must be grounded in the provided content or clearly marked as inferred. Use concrete numbers, metrics, and specific product/feature names when available.`;

export function buildUserPrompt(company: string, chunks: string): string {
  return `${SYSTEM_PROMPT}

Analyze this company: ${company}

Scraped content:
${chunks}

Return a single JSON object (no markdown, no explanation, no code fences) with exactly this schema:
{
  "isValid": "boolean - true if the company is a real, known entity with verifiable business operations, false if it appears to be gibberish, non-existent, or completely unknown",
  "overview": {
    "oneliner": "string - one sharp sentence describing what the company does",
    "positioning": "string - 2-3 sentence paragraph about market positioning",
    "founded": "string - founding year or 'Unknown'",
    "hq": "string - headquarters location or 'Unknown'",
    "employees": "string - employee count range or 'Unknown'",
    "stage": "string - e.g. 'Series B', 'Public', 'Bootstrapped', 'Unknown'",
    "tags": ["array", "of", "3-5", "industry/model tags"]
  },
  "swot": {
    "strengths": ["array of 4-5 specific strengths"],
    "weaknesses": ["array of 3-4 specific weaknesses"],
    "opportunities": ["array of 3-4 specific opportunities"],
    "threats": ["array of 3-4 specific threats"]
  },
  "competitors": [
    {
      "name": "string",
      "positioning": "string - brief positioning statement",
      "strengths": "string - key advantage",
      "pricing": "string - pricing model description",
      "target": "string - primary target market"
    }
  ],
  "scores": {
    "product": 7,
    "pricing": 6,
    "market_presence": 8,
    "brand": 7,
    "tech": 7,
    "community": 6
  },
  "news": [
    {
      "headline": "string",
      "source": "string",
      "date": "string - YYYY-MM-DD format or approximate",
      "summary": "string - one sentence summary",
      "sentiment": "positive | neutral | negative"
    }
  ]
}

If isValid is false, you should still attempt to fill other fields with "Unknown" or empty arrays/zeros, but the primary indicator of data quality is the isValid flag.

Include exactly 4-5 competitors. Include exactly 5-6 news items. Scores are 1-10.
CRITICAL: ONLY OUTPUT RAW JSON. DO NOT wrap the output in \`\`\`json\`\`\`. The first character of your response MUST be '{'.`;
}

export function chunkText(text: string, maxTokens = 1500): string[] {
  const chunkSize = maxTokens * 4;
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}
