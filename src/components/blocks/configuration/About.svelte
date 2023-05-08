<script>
	import { uistates_store } from "./../../../lib/stores/uistates.js";
import { _ } from 'svelte-i18n'
import Box	 from "./../../ui/Box.svelte";
import Logo  from "../../../assets/logo-mini.png"
</script>
<Box title={$_("config.titles.about")} icon="mdi:about-circle-outline" back={true}>
	{#if $uistates_store.breakpoint == "mobile" || $uistates_store.breakpoint == "mobilemini"}
	<div class="has-text-centered">
		<img src={Logo} alt="logo" />
		<!-- <span class="is-size-6 has-text-weight-bold">OpenEVSE</span> -->
		<!-- <span class="is-size-7">- {import.meta.env.VITE_VERSION}</span> -->
	</div>
	{/if}

	<div class="is-flex is-flex-direction-column is-align-items-center">
		<div>
			<div class="has-text-weight-bold is-size-6 mt-2 mb-2">
				<a href="https://openevse.stoplight.io/docs/openevse-wifi-v4/6e3b6e2f1b976-open-evse-wi-fi-esp-32-gateway-v4"  
					on:click|preventDefault={()=>{window.open("https://openevse.stoplight.io/docs/openevse-wifi-v4/6e3b6e2f1b976-open-evse-wi-fi-esp-32-gateway-v4");return false}}>	
					<iconify-icon inline icon="fa6-solid:book"></iconify-icon>
						Documentation
				</a>
			</div>
			<!-- <div class="has-text-weight-bold is-size-6 mt-2 has-text-dark">
				Repositories
			</div> -->
			<div class="is-inline-block has-text-weight-bold">
				<div class="my-1">
					<a class="is-size-6 is-flex is-align-items-center" href="https://github.com/OpenEVSE/ESP32_WiFi_V4.x" on:click|preventDefault={()=>{window.open("https://github.com/OpenEVSE/ESP32_WiFi_V4.x");return false}}>
						<iconify-icon inline icon="icon-park-outline:github"></iconify-icon>
						<span class="ml-1">OpenEVSE WiFi firmware</span>
					</a>
				</div>
				<div class="my-1">
					<a class="is-size-6 is-flex is-align-items-center" href="https://github.com/OpenEVSE/open_evse" on:click|preventDefault={()=>{window.open("https://github.com/OpenEVSE/open_evse");return false}}>
						<iconify-icon inline icon="icon-park-outline:github"></iconify-icon>
						<span class="ml-1">OpenEVSE module firmware</span>
					</a>
				</div>
				<div class="my-1">
					<a class="is-size-6 is-flex is-align-items-center" href="https://github.com/OpenEVSE/openevse-gui-v2" on:click|preventDefault={()=>{window.open("https://github.com/OpenEVSE/openevse-gui-v2");return false}}>	
						<iconify-icon inline icon="icon-park-outline:github"></iconify-icon>
						<span class="ml-1">OpenEVSE GUI v2</span>
					</a>
				</div>
			</div>	
		</div>
		
		<div class="">
			<div class="has-text-weight-bold is-size-6 mt-2 has-text-dark">Gui V2 built with</div>
			<div class="is-size-6">
				<a href="https://svelte.dev/" on:click|preventDefault={()=>{window.open("https://svelte.dev/");return false}}><iconify-icon inline icon="vscode-icons:file-type-svelte"></iconify-icon>Svelte </a>
				<a href="https://vitejs.dev/" on:click|preventDefault={()=>{window.open("https://vitejs.dev/");return false}}><iconify-icon inline icon="vscode-icons:file-type-vite"></iconify-icon>Vite </a>
				<a href="https://bulma.io" on:click|preventDefault={()=>{window.open("https://bulma.io");return false}}><iconify-icon inline icon="logos:bulma"></iconify-icon>Bulma </a> 
			</div>
			
		</div>
		<div class="has-text-centered is-size-7 mt-4 has-text-dark">
			Powered by <a href="https://www.openevse.com/">OpenEVSE</a> and <a href="https://openenergymonitor.org">OpenEnergyMonitor</a>
		</div>
	</div>

</Box>