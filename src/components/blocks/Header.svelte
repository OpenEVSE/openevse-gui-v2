<script>
	import logo from "../../assets/logo.png"
	import {onDestroy} from "svelte"
	import { link, location } from "svelte-spa-router"

	let logoid
	let hideDropDown = true
	let isBurgerActive = false
	let timeout

	onDestroy(()=>{
		clearTimeout(timeout)
	})

	function toggleBurger() {
		isBurgerActive = !isBurgerActive
	}

	function toggleMenu() {
		isBurgerActive = false;
		hideDropDown = false;
		logoid.focus()
		timeout = setTimeout(() => hideDropDown = true, 100)
	}

</script>

<style> 
.burger { 
	margin-left: auto;
	margin-right: 0;
		}
.noevent {
	pointer-events: none;
	cursor: not-allowed;
}

</style>

<div class="pb-1">
	<nav class="navbar nav is-white is-spaced is-fixed-top" aria-label="main navigation">
		<div class="navbar-brand">
			<a href="/" use:link bind:this={logoid}>
				<img src={logo} class="" alt="logo"/>
			</a>
				<div role="button" class="navbar-burger burger {isBurgerActive ? 'is-active' : ''}" aria-label="menu" aria-expanded="true" data-target="evsenav" on:click={toggleBurger} on:keypress={toggleBurger}>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</div>
		</div>
	
		<div id="evsenav" class="navbar-menu {isBurgerActive?'is-active':''}">

	
			<div class="navbar-start ml-5 is-uppercase">
				
				<a class="navbar-item is-size-6 is-hoverable {($location=="/")?"has-text-info noevent is-active has-background-white":"has-text-grey-dark"}" href="/" on:click={toggleMenu} use:link>Main</a>
				<a class="navbar-item is-size-6 is-hoverable {($location=="/supervision")?"has-text-info noevent is-active has-background-white":"has-text-grey-dark"}" href="/supervision" on:click={toggleMenu} use:link>Supervision</a>
				<a class="navbar-item is-size-6 is-hoverable {($location=="/logs")?"has-text-info noevent is-active has-background-white":"has-text-grey-dark"}" href="/logs" on:click={toggleMenu} use:link>Logs</a>
				<div class="navbar-item has-dropdown {hideDropDown?"is-hoverable":""}">
					<a class="navbar-item is-size-6 is-hoverable {$location=="/configuration"?"has-text-info":"has-text-grey-dark"}" href="/configuration" on:click={toggleMenu} use:link>Configuration</a>
					<div class="navbar-dropdown is-boxed" >
						<a class="navbar-item is-size-6  is-hoverable {$location=="/configuration/system"?"has-text-info noevent is-active":"has-text-grey-dark"}" href="/configuration/system" on:click={toggleMenu} use:link >System</a>
						<a class="navbar-item is-size-6  is-hoverable {$location=="/configuration/services"?"has-text-info noevent is-active":"has-text-grey-dark"}" href="/configuration/services" on:click={toggleMenu} use:link>Services</a>
						<a class="navbar-item is-size-6  is-hoverable {$location=="/configuration/charge"?"has-text-info noevent is-active":"has-text-grey-dark"}" href="/configuration/charge" on:click={toggleMenu} use:link>Charge</a>
					</div>
				</div>
				
			</div>
		</div>
	</nav>
</div>