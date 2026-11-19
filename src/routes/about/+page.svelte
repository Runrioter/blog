<svelte:head>
	<title>About | Runrioter Blog</title>
	<meta name="description" content="关于 Runrioter：身份、关注方向、写作风格与链接。" />
</svelte:head>

<div>
	<h1>About</h1>

	<h2>Profile</h2>
	<ul class="kv">
		<li><span>Name</span> Runrioter</li>
		<li><span>Identity</span> Human-made, AI-free</li>
		<li><span>Role</span> Developer, writer, builder</li>
	</ul>

	<h2>Focus</h2>
	<p>CSS 布局 / AWS 基础设施 / AI 提示词工程。</p>

	<h2>Writing style</h2>
	<ul class="bullets">
		<li>实用模板优先，不写空泛概念</li>
		<li>明确写出工程取舍</li>
		<li>从想法到实现走最短路径</li>
	</ul>

	<h2>Links</h2>
	<p><a href="https://github.com/Runrioter" rel="noopener external">GitHub: runrioter</a></p>
</div>

<style>
	h1 {
		font-family: var(--font-mono);
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0 0 0.8rem;
		color: var(--fg);
	}

	h2 {
		font-family: var(--font-mono);
		font-size: 1rem;
		margin: 1.4rem 0 0.5rem;
		color: var(--fg-muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	p {
		color: var(--fg-muted);
		font-size: 0.92rem;
		line-height: 1.7;
	}

	.kv,
	.bullets {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.kv li {
		color: var(--fg);
		font-size: 0.92rem;
	}

	.kv span {
		display: inline-block;
		min-width: 8rem;
		color: var(--fg-faint);
		font-family: var(--font-mono);
		font-size: 0.85rem;
	}

	.bullets li {
		color: var(--fg-muted);
		font-size: 0.92rem;
	}

	.bullets li::before {
		content: '▸ ';
		color: var(--green);
	}

	a {
		color: var(--link);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>
