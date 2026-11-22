<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Path } from '$app/types';
	import { tocItems as aiToc } from './(tutorials)/ai/toc';
	import { tocItems as awsToc } from './(tutorials)/aws/toc';
	import { tocItems as devToc } from './(tutorials)/dev/toc';

	const cssToc = [
		{ path: 'css/bfc.md', label: 'Block Formatting Context' },
		{ path: 'css/contain.md', label: 'Contain' },
		{ path: 'css/flex.md', label: 'Flex' },
		{ path: 'css/position.md', label: 'Position' }
	] as const satisfies { path: Path; label: string }[];

	type TocItem = { path: Path; label: string };

	const sections: {
		name: string;
		path: Path;
		description: string;
		items: readonly TocItem[];
	}[] = [
		{
			name: 'AI 提示词工程',
			path: 'ai',
			description: '从基础概念到 Agent 行为设计：为代码智能体编写高质量提示词。',
			items: aiToc
		},
		{
			name: 'CSS 布局',
			path: 'css',
			description: 'BFC、contain、flexbox 与定位：可预测的布局行为。',
			items: cssToc
		},
		{
			name: 'AWS 基础设施',
			path: 'aws',
			description: '可部署、可回滚的基础设施即代码实践。',
			items: awsToc
		},
		{
			name: 'Dev 工程实践',
			path: 'dev',
			description: 'Makefile 与 shell 语法边界的工程排错笔记。',
			items: devToc
		}
	];
</script>

<svelte:head>
	<title>Runrioter Blog</title>
	<meta
		name="description"
		content="AI prompt engineering, CSS layout, AWS infrastructure, and dev tooling notes. Browse the table of contents, or open the terminal for command navigation."
	/>
</svelte:head>

<div>
	<h1>Runrioter Blog</h1>

	<p class="intro">
		一个终端风格的文档站：<strong>文档</strong>是主角，下方目录可直接点击阅读；需要交互时，点击底部
		<code>Terminal</code>
		按钮唤出命令行（<code>open about.md</code>、<code>cd ai</code>），也可以用
		<code>help</code>
		查看全部命令。
	</p>

	<h2>目录</h2>

	{#each sections as section (section.path)}
		<div class="section">
			<h3><a href={resolve(section.path)}>{section.name}</a></h3>
			<p class="section-desc">{section.description}</p>
			<ul>
				{#each section.items as item (item.path)}
					<li>
						<a href={resolve(item.path)}>{item.label}</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}

	<div class="section">
		<h3><a href={resolve('about.md')}>About</a></h3>
		<p class="section-desc">作者、写作风格与链接。</p>
	</div>
</div>

<style>
	h1 {
		font-family: var(--font-mono);
		font-size: 1.7rem;
		font-weight: 600;
		margin: 0 0 0.8rem;
		color: var(--fg);
	}

	h2 {
		font-family: var(--font-mono);
		font-size: 1.1rem;
		margin: 1.6rem 0 0.6rem;
		color: var(--fg-muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.intro {
		color: var(--fg-muted);
		font-size: 0.95rem;
		line-height: 1.7;
		max-width: 46rem;
		margin: 0 0 0.4rem;
	}

	.intro code {
		font-family: var(--font-mono);
		font-size: 0.85em;
		color: var(--link);
		background: var(--code-bg);
		border-radius: 0.25rem;
		padding: 0.08em 0.3em;
	}

	.section {
		padding: 0.7rem 0 0.4rem;
		border-top: 1px solid var(--border-soft);
	}

	.section h3 {
		margin: 0 0 0.3rem;
		font-family: var(--font-mono);
		font-size: 1.05rem;
	}

	.section h3 a {
		color: var(--fg);
		text-decoration: none;
		border-bottom: 1px dashed var(--border);
	}

	.section h3 a:hover {
		color: var(--link);
	}

	.section-desc {
		margin: 0 0 0.5rem;
		color: var(--fg-muted);
		font-size: 0.88rem;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 1.1rem;
	}

	li a {
		color: var(--link);
		font-family: var(--font-mono);
		font-size: 0.9rem;
		text-decoration: none;
	}

	li a::before {
		content: '▸ ';
		color: var(--bullet);
	}

	li a:hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>
