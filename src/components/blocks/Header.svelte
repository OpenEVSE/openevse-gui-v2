<script>
  import logo from '../../assets/logo.png'
  import { link, location } from "svelte-spa-router"

  let logoid
  let hideDropDown = true
  let isBurgerActive = false

  function toggleBurger() {
	isBurgerActive = !isBurgerActive
  }
  function toggleMenu() {
	isBurgerActive = false;
	hideDropDown = false;
	logoid.focus()
	setTimeout(() => hideDropDown = true, 10)
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
<div class="container pb-1">
	<nav class="navbar nav is-white is-spaced is-fixed-top" aria-label="main navigation">
		<div class="navbar-brand">
			<a href="/" use:link bind:this={logoid}>
				<img src={logo} class="" alt="logo"/>
			</a>
				<div role="button" class="navbar-burger burger {isBurgerActive ? 'is-active' : ''}" aria-label="menu" aria-expanded="true" data-target="evsenav" on:click={toggleBurger}>
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
					<span class="navbar-item is-size-6  noevent {!$location.includes("/config")?"has-text-grey-dark ":isBurgerActive?"has-text-grey-dark":"has-text-info"}">Configuration</span>
					<div class="navbar-dropdown is-boxed" >
						<a class="navbar-item is-size-6  is-hoverable {$location=="/config/System"?"has-text-info noevent is-active":"has-text-grey-dark"}" href="/config/System" on:click={toggleMenu} use:link >System</a>
						<a class="navbar-item is-size-6  is-hoverable {$location=="/config/Settings"?"has-text-info noevent is-active":"has-text-grey-dark"}" href="/config/Settings" on:click={toggleMenu} use:link>Settings</a>
						<a class="navbar-item is-size-6  is-hoverable {$location=="/config/Charge"?"has-text-info noevent is-active":"has-text-grey-dark"}" href="/config/Charge" on:click={toggleMenu} use:link>Charge</a>
						<a class="navbar-item is-size-6  is-hoverable {$location=="/config/MQTT"?"has-text-info noevent is-active":"has-text-grey-dark"}" href="/config/MQTT" on:click={toggleMenu} use:link>MQTT</a>
						<a class="navbar-item is-size-6  is-hoverable {$location=="/config/Services"?"has-text-info noevent is-active":"has-text-grey-dark"}" href="/config/Services" on:click={toggleMenu} use:link>Services</a>
						<a class="navbar-item is-size-6  is-hoverable {$location=="/config/Vehicle"?"has-text-info noevent is-active":"has-text-grey-dark"}" href="/config/Vehicle" on:click={toggleMenu} use:link>Vehicle</a>
					</div>
				</div>
				
			</div>
		</div>
	</nav>
</div>