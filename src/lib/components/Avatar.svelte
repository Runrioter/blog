<script lang="ts">
	interface AvatarProps {
		logo: string;
		href: string;
		alt?: string;
		// Set when the logo is a dark-color asset (e.g. the black GitHub mark)
		// so it renders white on the dark theme via Tailwind's dark: variant.
		invertOnDark?: boolean;
	}
	let { logo, href, alt = 'avatar', invertOnDark = false }: AvatarProps = $props();
</script>

<div class="flex h-12 w-12 items-center justify-center">
	<a target="_blank" rel="noopener external" {href}>
		<img
			class="h-8 w-8 rounded-full object-contain{invertOnDark ? ' dark:invert' : ''}"
			src={logo}
			{alt}
		/>
	</a>
</div>
