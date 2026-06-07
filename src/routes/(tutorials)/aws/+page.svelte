<script lang="ts">
	import InteractiveTerminal from '$lib/components/InteractiveTerminal.svelte';
	import { awsTerminalProfile } from '$lib/terminal-profiles';

	const now = new Date().toISOString().slice(0, 10);
</script>

<svelte:head>
	<title>AWS</title>
	<meta name="description" content="About AWS" />
</svelte:head>

<InteractiveTerminal
	historyKey={awsTerminalProfile.historyKey}
	introLines={awsTerminalProfile.introLines(now)}
	hint={awsTerminalProfile.hint}
	dirs={awsTerminalProfile.dirs}
	files={awsTerminalProfile.files}
	internalRoutes={awsTerminalProfile.internalRoutes}
	helpExamples={awsTerminalProfile.helpExamples}
/>
