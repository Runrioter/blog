<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>CSS - Flex</title>
	<meta name="description" content="CSS Flex" />
</svelte:head>

<h1 class="w-full text-center text-[2rem] font-normal">Flex</h1>

<div class="mx-0 my-auto flex grow-[0.6] flex-col justify-center">
	<header class="h-24 bg-purple-500">
		<h1>Sample flexbox example</h1>
	</header>

	<section class="flex flex-row flex-wrap">
		<article class="article">
			<h2>First article</h2>

			<p>
				Tacos actually microdosing, pour-over semiotics banjo chicharrones retro fanny pack portland
				everyday carry vinyl typewriter. Tacos PBR&B pork belly, everyday carry ennui pickled
				sriracha normcore hashtag polaroid single-origin coffee cold-pressed. PBR&B tattooed trust
				fund twee, leggings salvia iPhone photo booth health goth gastropub hammock.
			</p>
		</article>

		<article class="article">
			<h2>Second article</h2>

			<p>
				Tacos actually microdosing, pour-over semiotics banjo chicharrones retro fanny pack portland
				everyday carry vinyl typewriter. Tacos PBR&B pork belly, everyday carry ennui pickled
				sriracha normcore hashtag polaroid single-origin coffee cold-pressed. PBR&B tattooed trust
				fund twee, leggings salvia iPhone photo booth health goth gastropub hammock.
			</p>
		</article>

		<article class="article grow-[2]">
			<h2>Third article</h2>

			<p>
				Tacos actually microdosing, pour-over semiotics banjo chicharrones retro fanny pack portland
				everyday carry vinyl typewriter. Tacos PBR&B pork belly, everyday carry ennui pickled
				sriracha normcore hashtag polaroid single-origin coffee cold-pressed. PBR&B tattooed trust
				fund twee, leggings salvia iPhone photo booth health goth gastropub hammock.
			</p>

			<p>
				Cray food truck brunch, XOXO +1 keffiyeh pickled chambray waistcoat ennui. Organic small
				batch paleo 8-bit. Intelligentsia umami wayfarers pickled, asymmetrical kombucha letterpress
				kitsch leggings cold-pressed squid chartreuse put a bird on it. Listicle pickled man bun
				cornhole heirloom art party.
			</p>
		</article>
	</section>
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";
	header > h1 {
		text-align: center;
		color: white;
		line-height: 100px;
		margin: 0;
		transition: background-color 2s;
	}
	header > h1:hover {
		background-color: brown;
	}

	.article {
		@apply m-3 shrink grow basis-[200px] bg-red-500 p-3;
	}
</style>
