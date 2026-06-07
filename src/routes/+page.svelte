<script lang="ts">
	import InteractiveTerminal from '$lib/components/InteractiveTerminal.svelte';
	import { homeTerminalProfile } from '$lib/terminal-profiles';

	const now = new Date().toISOString().slice(0, 10);
</script>

<svelte:head>
	<title>Runrioter Blog Terminal</title>
	<meta name="description" content="Interactive terminal homepage for Runrioter Blog." />
</svelte:head>

<InteractiveTerminal
	historyKey={homeTerminalProfile.historyKey}
	introLines={homeTerminalProfile.introLines(now)}
	hint={homeTerminalProfile.hint}
	dirs={homeTerminalProfile.dirs}
	files={homeTerminalProfile.files}
	internalRoutes={homeTerminalProfile.internalRoutes}
	helpExamples={homeTerminalProfile.helpExamples}
/>
