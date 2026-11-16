<script lang="ts">
	import SectionToc from '#lib/components/SectionToc.svelte';
	import { tocItems } from './toc';
</script>

<svelte:head>
	<title>AI 提示词工程 | Runrioter Blog</title>
	<meta
		name="description"
		content="AI 提示词工程教程：学习如何为 Codex、VS Code Agent 等编写高质量的提示词"
	/>
</svelte:head>

<SectionToc
	title="AI 提示词工程"
	description="从基础概念到系统指令、Agent 行为设计与输出格式规范——面向代码智能体的提示词工程。"
	items={tocItems}
/>
