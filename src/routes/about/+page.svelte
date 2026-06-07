<script lang="ts">
	import InteractiveTerminal from '$lib/components/InteractiveTerminal.svelte';
	import { aboutTerminalProfile } from '$lib/terminal-profiles';

	const now = new Date().toISOString().slice(0, 10);
</script>

<svelte:head>
	<title>About Terminal | Runrioter Blog</title>
	<meta
		name="description"
		content="Interactive about terminal with developer-focused startup context."
	/>
</svelte:head>

<InteractiveTerminal
	historyKey={aboutTerminalProfile.historyKey}
	introLines={aboutTerminalProfile.introLines(now)}
	hint={aboutTerminalProfile.hint}
	dirs={aboutTerminalProfile.dirs}
	files={aboutTerminalProfile.files}
	internalRoutes={aboutTerminalProfile.internalRoutes}
	helpExamples={aboutTerminalProfile.helpExamples}
/>
