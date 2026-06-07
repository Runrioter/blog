<script lang="ts">
	import DocProse from '$lib/components/DocProse.svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount, tick } from 'svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
	let contentEl: HTMLElement | undefined;
	let sectionItems = $state<Array<{ id: string; text: string }>>([]);
	let activeSectionId = $state<string>('');
	let observer: IntersectionObserver | undefined;

	const tocItems = [
		{ path: '/ai/basics', label: '基础概念' },
		{ path: '/ai/system-instructions', label: '系统指令设计' },
		{ path: '/ai/agent-design', label: 'Agent 行为设计' },
		{ path: '/ai/formatting', label: '输出格式规范' }
	] as const;

	const aiEntryPath = resolve('/ai');
	const isAiEntryRoute = () => page.url.pathname === aiEntryPath;

	const updateSectionItems = () => {
		observer?.disconnect();
		observer = undefined;

		if (!contentEl) {
			sectionItems = [];
			activeSectionId = '';
			return;
		}

		const headings = Array.from(contentEl.querySelectorAll('h2'));
		sectionItems = headings.map((heading, index) => {
			if (!heading.id) {
				heading.id = `section-${index + 1}`;
			}

			return {
				id: heading.id,
				text: heading.textContent?.trim() ?? `Section ${index + 1}`
			};
		});

		activeSectionId = sectionItems[0]?.id ?? '';

		observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio);

				if (visible.length > 0) {
					activeSectionId = (visible[0].target as HTMLElement).id;
				}
			},
			{
				root: null,
				rootMargin: '-88px 0px -60% 0px',
				threshold: [0.1, 0.4, 0.8]
			}
		);

		for (const heading of headings) {
			observer.observe(heading);
		}
	};

	const goToSection = (id: string) => {
		activeSectionId = id;
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		history.replaceState(null, '', `#${id}`);
	};

	onMount(() => {
		let mounted = true;

		const init = async () => {
			await tick();
			if (mounted) {
				updateSectionItems();
			}
		};

		void init();

		return () => {
			mounted = false;
			observer?.disconnect();
		};
	});

	$effect(() => {
		const pathname = page.url.pathname;
		tick().then(() => {
			if (pathname === page.url.pathname) {
				updateSectionItems();
			}
		});
	});
</script>

{#if isAiEntryRoute()}
	<div class="grow">
		{@render children()}
	</div>
{:else}
	<nav
		class="mx-auto mt-2 mb-4 flex w-full max-w-4xl flex-wrap gap-2 px-2"
		aria-label="AI 教程目录"
	>
		{#each tocItems as item (item.path)}
			<a
				href={resolve(item.path)}
				aria-current={page.url.pathname === resolve(item.path) ? 'page' : undefined}
				class="rounded-sm border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-sm text-slate-300 transition-colors hover:border-slate-500 hover:text-slate-100 aria-[current=page]:border-slate-300 aria-[current=page]:bg-slate-800 aria-[current=page]:text-slate-100"
			>
				{item.label}
			</a>
		{/each}
	</nav>

	<div class="mx-auto grid w-full max-w-6xl gap-6 px-2 lg:grid-cols-[220px_minmax(0,1fr)]">
		{#if sectionItems.length > 0}
			<aside class="hidden lg:block">
				<div class="sticky top-20 rounded-sm border border-slate-700 bg-slate-900 p-3">
					<p class="mb-2 font-mono text-xs font-medium tracking-wide text-slate-400 uppercase">
						本页目录
					</p>
					<ul class="space-y-1">
						{#each sectionItems as section (section.id)}
							<li>
								<button
									type="button"
									aria-current={activeSectionId === section.id ? 'true' : undefined}
									onclick={() => goToSection(section.id)}
									class="w-full rounded-sm px-2 py-1 text-left font-mono text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 aria-[current=true]:bg-slate-200 aria-[current=true]:text-slate-900"
								>
									{section.text}
								</button>
							</li>
						{/each}
					</ul>
				</div>
			</aside>
		{/if}

		<DocProse onElement={(element) => (contentEl = element)}>
			{@render children()}
		</DocProse>
	</div>
{/if}
