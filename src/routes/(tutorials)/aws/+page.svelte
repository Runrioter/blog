<script lang="ts">
	import SectionToc from '#lib/components/SectionToc.svelte';
	import { tocItems } from './toc';
</script>

<svelte:head>
	<title>AWS 基础设施 | Runrioter Blog</title>
	<meta name="description" content="AWS 基础设施笔记：可部署、可回滚的 IaC 实践。" />
</svelte:head>

<SectionToc
	title="AWS 基础设施"
	description="面向部署与回滚的 AWS 实践笔记：从 CloudFormation 开始。"
	items={tocItems}
/>
