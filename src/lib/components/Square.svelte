<script lang="ts">
	interface Props {
		text: string;
		position?: 'left' | 'right' | 'top' | 'bottom';
		float?: 'none' | 'left' | 'right' | 'start' | 'end';
	}

	const { text, position, float }: Props = $props();

	const floatMap = {
		none: 'float-none',
		left: 'float-left',
		right: 'float-right',
		start: 'float-start',
		end: 'float-end'
	};
</script>

<div
	class={[
		'size-10 border-1 border-solid bg-amber-400/50 text-center text-base/10',
		position && `absolute position-${position} float-left`,
		float && floatMap[float]
	]}
>
	{text}
</div>

<style lang="postcss">
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
