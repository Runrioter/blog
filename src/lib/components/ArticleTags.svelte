<script lang="ts">
	/**
	 * Article tag pills, rendered from the vault note's frontmatter `tags`
	 * (see scripts/sync-content.ts — the generated +page.svx embeds this
	 * component with a static tag list). Display-only: tags carry no href.
	 */
	let { tags = [] }: { tags?: string[] } = $props();
</script>

{#if tags.length > 0}
	<ul class="article-tags" aria-label="Tags">
		{#each tags as tag (tag)}
			<li class="article-tag">{tag}</li>
		{/each}
	</ul>
{/if}

<style>
	.article-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		list-style: none;
		margin: 0.25rem 0 1rem;
		padding: 0;
	}

	.article-tag {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		line-height: 1;
		padding: 0.3rem 0.55rem;
		border-radius: 999px;
		border: 1px solid color-mix(in oklab, var(--color-accent, #3fb950) 35%, transparent);
		color: var(--color-accent, #3fb950);
		background: color-mix(in oklab, var(--color-accent, #3fb950) 8%, transparent);
		user-select: none;
	}
</style>
