import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || !query.trim()) {
      return NextResponse.json({ results: [] });
    }

    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      next: { revalidate: 1800 } // Cache results for 30 minutes to reduce outbound requests and rate limits
    });

    if (!res.ok) {
      console.error('DuckDuckGo search fetch failed with status:', res.status);
      return NextResponse.json({ results: [] });
    }

    const html = await res.text();

    const results: Array<{ title: string; url: string; snippet: string }> = [];
    const resultBlockRegex = /<div class="[^"]*result results_links[^"]*">([\s\S]*?)(?=<div class="result results_links|$)/g;
    let match;

    while ((match = resultBlockRegex.exec(html)) !== null) {
      const block = match[1];

      // Extract title and href from result__a
      const titleMatch = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i.exec(block);
      // Extract snippet from result__snippet
      const snippetMatch = /<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/i.exec(block);

      if (titleMatch) {
        let href = titleMatch[1];
        let title = titleMatch[2].replace(/<[^>]*>/g, '').trim(); // Strip HTML tags
        let snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]*>/g, '').trim() : '';

        // Clean URL prefix
        if (href.startsWith('//')) {
          href = 'https:' + href;
        }

        try {
          const urlObj = new URL(href);
          const uddg = urlObj.searchParams.get('uddg');
          if (uddg) {
            href = decodeURIComponent(uddg);
          }
        } catch (e) {
          // Keep original href if URL parsing fails
        }

        // Only include actual search results, filter out DDG navigation or info links
        if (title && href && !href.includes('duckduckgo.com/html') && !href.includes('duckduckgo.com/lite')) {
          results.push({
            title,
            url: href,
            snippet,
          });
        }
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error in search API route:', error);
    return NextResponse.json({ results: [], error: 'Internal Server Error' }, { status: 500 });
  }
}
