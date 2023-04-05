<script>
	import Box  from "./../../ui/Box.svelte";
	import Logo from "./../../../assets/logo-mini.png"
	
	function openurl() {
		if (navigator.userAgent.match(/Android/i))
			window.location.href = "intent://" + window.location.host + "/#/wizard#Intent;scheme=http;end"
		else if (navigator.userAgent.match(/iPhone|iPad/i))
			window.location.href = "http://" + window.location.host + "/success.html"
	}
</script>
<Box title="Setup" icon="fa6-solid:gear">
	<div class="has-text-centered mt-4">
		<div class="has-text-info is-size-4">Welcome to</div>
		<img src={Logo} alt="logo" />
		<div class="mt-4 mb-4 has-text-left">
			First initialisation, please follow this quick setup process.
			{#if navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad/i)}
			<div class="mt-4">
				If you're not in a browser (but in captive portal window), click on button below
				<div class="has-text-centered">
					<button class="button is-info" on:click={openurl}>
						Open in browser
					</button>
				</div>
			</div>
			{/if}
		</div>	
	</div>

</Box>