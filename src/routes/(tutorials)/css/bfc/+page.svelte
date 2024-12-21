<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<svelte:head>
    <title>Block formatting context</title>
	<meta name="description" content="Block formatting context" />
</svelte:head>

<h1>Block Formatting Context</h1>

<div class="my-10 mx-auto ">
    <div class="box">
        <div class="float mb-2">
            float: left
        </div>
        <div>No Block Formatting Context</div>
    </div>
    <div class="box flex clear-left">
        <div class="float">
            float: left
        </div>
        <div>
            use <code>flex</code> to create Block formatting context
        </div>
    </div>
</div>

<style>
    .box {
        @apply border border-red-300 mt-2;
    }
    .float {
        @apply float-left w-[100px] h-[100px] bg-amber-200 flex flex-col justify-center items-center text-nowrap;
    }
</style>
