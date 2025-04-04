<svelte:head>
    <title>Caffiene</title>
    <meta name="description" content="The best priced v refresh in Auckland CBD" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.png?v=1" type="image/png">
</svelte:head>

<script lang="ts">
    import { onMount } from 'svelte';
    
    let url = "/api"
	interface PriceDetails {
		[key: string]: {
			unit: string;
			quantity: number;
			price: number;
			price_per_unit: number;
			store_full_name: string;
			is_available: boolean;
		};
	}

    interface Product {
        id: number;
        name: string;
        quantity: number;
        unit: string;
        price_details: PriceDetails;
    }

	interface ApiResponse {
		success: boolean;
		status: number;
		data: Product[];
	}

	let data: ApiResponse | null = null;

    let bestPrice: Number | null = null;
    let bestPriceSize = "Loading...";
    let bestPriceStore = "Loading...";

    // Fetch data from the API
    onMount(async () => {
        const response = await fetch(url);
        if (response.ok) {
            data = await response.json();
        } else {
            console.error('Failed to fetch data:', response.statusText);
            let bestPrice = Infinity;
            let bestPriceSize = "27 L";
            let bestPriceStore = "Nowhere";
        }

        let smallCan: Product | undefined = data?.data.find((item: Product) => item.id === 706549054);
        let largeCan: Product | undefined = data?.data.find((item: Product) => item.id === 744712754);

        if (smallCan && largeCan) {
            const smallCanPrices = Object.values(smallCan.price_details).filter(detail => detail.is_available);
            const largeCanPrices = Object.values(largeCan.price_details).filter(detail => detail.is_available);

            const bestSmallCan = smallCanPrices.reduce((prev, curr) => (curr.price < prev.price ? curr : prev), { price: Infinity, store_full_name: "nowhere"});
            const bestLargeCan = largeCanPrices.reduce((prev, curr) => (curr.price < prev.price ? curr : prev), { price: Infinity, store_full_name: "nowhere"});

            if (bestSmallCan.price < bestLargeCan.price) {
                bestPrice = bestSmallCan.price;
                bestPriceSize = "250ml";
                bestPriceStore = bestSmallCan.store_full_name;
            } else {
                bestPrice = bestLargeCan.price;
                bestPriceSize = "500ml";
                bestPriceStore = bestLargeCan.store_full_name;
            }

            if (bestPriceStore === "New_World_metro_auckland") {
                bestPriceStore = "New World";
            } else if (bestPriceStore === "Countdown_auckland_city") {
                bestPriceStore = "Countdown";
            } else if (bestPriceStore === "The_Warehouse") {
                bestPriceStore = "The Warehouse";
            } else {
                bestPriceStore = "Nowhere";
            }
        } else {
            bestPrice = Infinity;
            bestPriceStore = "Nowhere";
            bestPriceSize = "4 GB"
        }

    });



</script>

<div class="container mx-auto lg:py-40">
    <section class="title">
        <div class="my-10 flex flex-col">
            <span class="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text animate-gradient bg-300%">
                Caffiene
            </span>
            <span class="font-bold text-xl md:text-2xl lg:text-3xl">
                The best priced V Refresh in Auckland CBD
            </span>
            <span class="font-bold text-l md:text-xl lg:text-xl text-gray-500">
                (Blackcurrant Yuzu, of course)
            </span>
        </div>
    </section>
    <div class="spacer my-20" />

    <section class="content flex flex-row gap-40">
        <!-- Stats -->
        <div class="stats stats-vertical lg:stats-horizontal shadow">
            <div class="stat">
                <div class="stat-title">The Incredible</div>
				<div class="stat-value bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text animate-gradient bg-300%">Best Price</div>
                <div class="stat-desc">(hopefully it's good...)</div>
            </div>
            <div class="stat">
                <div class="stat-title">Best Size</div>
				<div class="stat-value bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text animate-gradient bg-300%">{bestPriceSize}</div>
                <div class="stat-desc">Incredible!</div>
            </div>

            <div class="stat">
                <div class="stat-title">Best Price</div>
                <div class="stat-value bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text animate-gradient bg-300%">{bestPrice ? "$" + bestPrice : "Loading..."}</div>
                <div class="stat-desc">Lowest price for energy drinks</div>
            </div>

            <div class="stat">
                <div class="stat-title">Best Store</div>
                <div class="stat-value bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text animate-gradient bg-300%">{bestPriceStore}</div>
                <div class="stat-desc">Store with the best price</div>
            </div>
        </div>
    </section>

    <div class="spacer my-20" />

    <!-- Store List -->
    <div class="store-prices">
        {#if data}
            {#each data.data.filter(product => product.id === 706549054 || product.id === 744712754) as product}
                <div class="product">
                    
                    <div class="spacer my-10" />
                    <div class="price-details stats stats-vertical lg:stats-horizontal shadow">
                        <div class="stat">
                            <div class="stat-title">Size</div>
                            <div class="stat-value">
                                {product.quantity}{product.unit.toUpperCase()}
                            </div> 
                        </div>
                        {#each Object.entries(product.price_details).filter(([_, details]) => details.is_available) as [store, details]}
                            <div class="stat">
                                <div class="stat-title">{store.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</div>
                                <div class="stat-value">${details.price}</div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        {:else}
            <!-- <p>Loading store prices...</p> -->
        {/if}
    </div>

</div>