<script lang="ts">
	import InteractiveTerminal from '$lib/components/InteractiveTerminal.svelte';
	import { cssTerminalProfile } from '$lib/terminal-profiles';

	const now = new Date().toISOString().slice(0, 10);
</script>

<svelte:head>
	<title>CSS</title>
	<meta name="description" content="About CSS" />
</svelte:head>

<InteractiveTerminal
	historyKey={cssTerminalProfile.historyKey}
	introLines={cssTerminalProfile.introLines(now)}
	hint={cssTerminalProfile.hint}
	dirs={cssTerminalProfile.dirs}
	files={cssTerminalProfile.files}
	internalRoutes={cssTerminalProfile.internalRoutes}
	helpExamples={cssTerminalProfile.helpExamples}
/>
