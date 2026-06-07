<script lang="ts">
	import avatar from '$lib/images/avatar.png';
	import github from '$lib/images/github.svg';
	import Avatar from '$lib/components/Avatar.svelte';
	import RotatableAvatar from '$lib/components/RotatableAvatar.svelte';
</script>

<header>
	<div class="left">
		<RotatableAvatar logo={avatar} alt="Runrioter's Github" />
		<p class="label">Runrioter Blog Terminal</p>
	</div>

	<Avatar logo={github} alt="Runrioter's Blog" href="https://github.com/Runrioter/blog" />
</header>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.left {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.label {
		margin: 0;
		font-size: 0.8rem;
		font-family: var(--font-mono);
		font-weight: 600;
		color: rgb(30 41 59 / 0.9);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
</style>
