<script lang="ts">
	import SectionToc from '#lib/components/SectionToc.svelte';
	import type { Path } from '$app/types';

	const items = [
		{ path: 'css/bfc', label: 'Block Formatting Context' },
		{ path: 'css/contain', label: 'Contain' },
		{ path: 'css/flex', label: 'Flex' },
		{ path: 'css/position', label: 'Position' }
	] as const satisfies { path: Path; label: string }[];
</script>

<svelte:head>
	<title>CSS 布局 | Runrioter Blog</title>
	<meta
		name="description"
		content="CSS 布局教程：BFC、contain、flexbox 与定位，可预测的布局行为。"
	/>
</svelte:head>

<SectionToc
	title="CSS 布局"
	description="布局隔离与定位：BFC、contain、flexbox 和 stacking——让 CSS 行为可预测。"
	{items}
/>
