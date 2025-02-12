<script lang="ts">
	interface Props {
		text: string;
		position: 'left' | 'right' | 'top' | 'bottom';
	}

	const { text, position }: Props = $props();
</script>

<div
	class={[
		'absolute size-10 border-1 border-solid bg-amber-400/50 text-center text-base/10',
		`position-${position}`
	]}
>
	{text}
</div>

<style>
	.position-left {
		top: 0;
		right: calc(100% + 2px);
	}
	.position-right {
		top: 0;
		left: calc(100% + 2px);
	}
	.position-top {
		bottom: calc(100% + 2px);
		left: 0;
	}
	.position-bottom {
		top: calc(100% + 2px);
		left: 0;
	}
</style>
