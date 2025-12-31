import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const headers = {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    };

    // Helper to fetch and extract
    const fetchImage = async (url: string, regex: RegExp) => {
        try {
            const res = await fetch(url, { headers, next: { revalidate: 3600 } });
            if (!res.ok) return null;
            const html = await res.text();

            // Normalize HTML for easier regex (optional, but helps with newlines)
            const cleanHtml = html.replace(/\n/g, ' ');

            const match = cleanHtml.match(regex);
            return match && match[1] ? match[1] : null;
        } catch (e) {
            return null;
        }
    };

    // Strategy 1: InstaNavigation (Often reliable for avatars)
    let imageUrl = await fetchImage(
        `https://instanavigation.com/user-profile/${username}`,
        /class="avatar"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"/
    );

    // Fallback/Simpler Regex for InstaNavigation
    if (!imageUrl) {
        imageUrl = await fetchImage(
            `https://instanavigation.com/user-profile/${username}`,
            /<img[^>]*src="([^"]+)"[^>]*class="avatar-img"/
        );
    }


    // Strategy 2: Picuki
    if (!imageUrl) {
        imageUrl = await fetchImage(
            `https://www.picuki.com/profile/${username}`,
            /class="profile-avatar-image"[^>]*src="([^"]+)"/
        );
    }

    // Strategy 3: Imginn
    if (!imageUrl) {
        imageUrl = await fetchImage(
            `https://imginn.com/${username}/`,
            /<img[^>]*src="([^"]+)"[^>]*class="user-icon"/
        );
    }

    if (imageUrl) {
        // Decode and clean URL
        imageUrl = imageUrl.replace(/&amp;/g, '&');
        // Sometimes mirrors return relative URLs
        if (imageUrl.startsWith('/')) {
            // This is tricky as we don't know the domain without passing it. 
            // We'll skip relative URLs for now or try to prepend if we knew the source.
            // But most profile images on these sites are absolute CDN links.
        }
        return NextResponse.json({ url: imageUrl });
    }

    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
}
