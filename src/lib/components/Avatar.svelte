<script lang="ts">
	interface AvatarProps {
		logo: string;
		href: string;
		alt?: string;
	}
	let { logo, href, alt = 'avatar' }: AvatarProps = $props();
</script>

<div class="flex h-12 w-12 items-center justify-center">
	<a target="_blank" {href}>
		<img class="h-8 w-8 rounded-full object-contain" src={logo} {alt} />
	</a>
</div>
