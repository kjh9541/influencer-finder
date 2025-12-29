import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    try {
        // Random User Agent to avoid immediate blocking, though IP rate limits apply
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

        const response = await fetch(`https://www.instagram.com/${username}/`, {
            headers: {
                'User-Agent': userAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error('Failed to fetch Instagram profile');
        }

        const html = await response.text();

        // Extract og:image
        // Matches: <meta property="og:image" content="..." />
        let match = html.match(/<meta property="og:image" content="([^"]+)"/);

        // Fallback to twitter:image
        if (!match) {
            match = html.match(/<meta name="twitter:image" content="([^"]+)"/);
        }

        if (match && match[1]) {
            // Decode HTML entities if necessary
            let imageUrl = match[1].replace(/&amp;/g, '&');
            return NextResponse.json({ url: imageUrl });
        } else {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Failed to scrape data' }, { status: 500 });
    }
}
