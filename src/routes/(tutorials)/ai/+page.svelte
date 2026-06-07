<script lang="ts">
	import InteractiveTerminal from '$lib/components/InteractiveTerminal.svelte';
	import { aiTerminalProfile } from '$lib/terminal-profiles';

	const now = new Date().toISOString().slice(0, 10);
</script>

<svelte:head>
	<title>AI 提示词工程</title>
	<meta
		name="description"
		content="AI 提示词工程教程：学习如何为 Codex、VS Code Agent 等编写高质量的提示词"
	/>
</svelte:head>

<InteractiveTerminal
	historyKey={aiTerminalProfile.historyKey}
	introLines={aiTerminalProfile.introLines(now)}
	hint={aiTerminalProfile.hint}
	dirs={aiTerminalProfile.dirs}
	files={aiTerminalProfile.files}
	internalRoutes={aiTerminalProfile.internalRoutes}
	helpExamples={aiTerminalProfile.helpExamples}
/>
