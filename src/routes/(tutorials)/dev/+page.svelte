<script lang="ts">
	import SectionToc from '#lib/components/SectionToc.svelte';
	import { tocItems } from './toc';
</script>

<svelte:head>
	<title>Dev 工程实践 | Runrioter Blog</title>
	<meta
		name="description"
		content="开发工具与工程实践笔记：Makefile、shell 语法边界与构建工具链排错。"
	/>
</svelte:head>

<SectionToc
	title="Dev 工程实践"
	description="构建工具链与工程实践中的排错笔记——从具体故障到语法边界与规范依据。"
	items={tocItems}
/>
