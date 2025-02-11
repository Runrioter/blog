<script lang="ts">
    interface Props {
        text: string;
        position: 'left' | 'right' | 'top' | 'bottom';
    }

    const { text, position = 'left' }: Props = $props();
</script>

<div class={['size-10 border-solid border-1 bg-amber-400/50 absolute text-center text-base/10', `position-${position}`]}>
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
