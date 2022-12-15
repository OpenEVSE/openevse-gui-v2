<script>
import 'iconify-icon';
import Box from "./../../ui/Box.svelte";
</script>
<Box title="About" icon="mdi:about-circle-outline">
	<div class="has-text-centered">
		<span class="is-size-6 has-text-weight-bold">OpenEVSE-UI</span>
		<span class="is-size-7">- {import.meta.env.VITE_VERSION}</span>
	</div>

	<div class="">
		<div>
			<div class="has-text-weight-bold is-size-6 mt-2">
				<a href="https://openevse.stoplight.io/docs/openevse-wifi-v4/6e3b6e2f1b976-open-evse-wi-fi-esp-32-gateway-v4" on:click|preventDefault={()=>{window.open("https://openevse.stoplight.io/docs/openevse-wifi-v4/6e3b6e2f1b976-open-evse-wi-fi-esp-32-gateway-v4");return false}}>	
					<iconify-icon inline icon="fa6-solid:book"></iconify-icon>
					 Documentation
				</a>
			</div>

		</div>
		<div class="has-text-weight-bold is-size-6 mt-2">
			<iconify-icon inline icon="icon-park:github"></iconify-icon>
			Repositories
		</div>
		<div class="is-inline-block">
			<div class="my-1">
				<a class="is-size-5 is-flex is-align-items-center" href="https://github.com/KipK/openevse-gui-v2" on:click|preventDefault={()=>{window.open("https://github.com/KipK/openevse-gui-v2");return false}}>	
					<span class="ml-1 is-size-6">OpenEVSE-UI</span>
				</a>
			</div>
			<div class="my-1">
				<a class="is-size-5 is-flex is-align-items-center" href="https://github.com/OpenEVSE/ESP32_WiFi_V4.x" on:click|preventDefault={()=>{window.open("https://github.com/OpenEVSE/ESP32_WiFi_V4.x");return false}}>
					<span class="ml-1 is-size-6">OpenEVSE WiFi</span>
				</a>
			</div>
			<div class="my-1">
				<a class="is-size-5 is-flex is-align-items-center" href="https://github.com/OpenEVSE/open_evse" on:click|preventDefault={()=>{window.open("https://github.com/OpenEVSE/open_evse");return false}}>
					<span class="ml-1 is-size-6">OpenEVSE</span>
				</a>
			</div>
		</div>	
		<div class="">
			<div class="has-text-weight-bold is-size-6 mt-2">User interface powered by</div>
			<div class="is-size-6">
				<a href="https://svelte.dev/" on:click|preventDefault={()=>{window.open("https://svelte.dev/");return false}}><iconify-icon inline icon="vscode-icons:file-type-svelte"></iconify-icon>Svelte </a>
				<a href="https://vitejs.dev/" on:click|preventDefault={()=>{window.open("https://vitejs.dev/");return false}}><iconify-icon inline icon="vscode-icons:file-type-vite"></iconify-icon>Vite </a>
				<a href="https://bulma.io" on:click|preventDefault={()=>{window.open("https://bulma.io");return false}}><iconify-icon inline icon="logos:bulma"></iconify-icon>Bulma </a> 
			</div>
			
		</div>
		<div class="has-text-centered is-size-7 mt-4">
			Powered by <a href="https://www.openevse.com/">OpenEVSE</a> and <a href="https://openenergymonitor.org">OpenEnergyMonitor</a>
		</div>
	</div>

</Box>