import { json } from '@sveltejs/kit';

export async function GET() {
    const apiUrl = 'https://grosave.co.nz/api/product/completeSearch?product=red%20bull&page=1&storeId=475&storeId=210&storeId=1808&storeId=213&storeId=30&sortedBy=relevance&sortOrder=asc&cutOffOldData=true';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            return json({ error: 'Failed to fetch data from the external API' }, { status: response.status });
        }

        const data = await response.json();
        return json(data);
    } catch {
        return json({ error: 'An error occurred while fetching data' }, { status: 500 });
    }
}
