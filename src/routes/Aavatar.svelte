<script lang="ts">
    
    let { logo, href, alt = 'avatar' } = $props();

    let flipped = $state(false);

    function flip(event: Event) {
        event.preventDefault();
        flipped = !flipped;
    }
</script>

<div class="w-12 h-12">
    <a onclick={flip} style="transform-style: preserve-3d;" class="flex items-center justify-center w-full h-full" href={href}>
        <img class="w-8 h-8 absolute object-contain rounded-full transition duration-1000 front" style:transform={ flipped ? 'rotateY(180deg)' : 'rotateY(0)' } src={logo} alt={alt} />
    </a>
</div>

<style>

</style>
