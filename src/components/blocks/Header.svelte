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


console.log($location)

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
<div class="container">
	<nav class="navbar is-white is-spaced" aria-label="main navigation">
		<div class="navbar-brand">
			<a href="/" use:link bind:this={logoid}>>
				<img src={logo} class="" alt="logo"/>
			</a>
				<div role="button" class="navbar-burger burger {isBurgerActive ? 'is-active' : ''}" aria-label="menu" aria-expanded="true" data-target="evsenav" on:click={toggleBurger}>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</div>
		</div>
	
		<div id="evsenav" class="navbar-menu {isBurgerActive?'is-active':''}">

	
			<div class="navbar-end is-family-monospace">
				
				<a class="navbar-item is-size-6 has-text-weight-semibold  is-hoverable {($location=="/")?"has-text-info noevent is-active has-background-white":"has-text-grey-dark"}" href="/" on:click={toggleMenu} use:link>Main</a>
				<div class="navbar-item has-dropdown {hideDropDown?"is-hoverable":""}">
					<span class="navbar-item is-size-6 has-text-weight-semibold navbar-link noevent {$location=="/"?"has-text-grey-dark ":"has-text-info"}">Configuration</span>
					<div class="navbar-dropdown is-boxed " >
						<a class="navbar-item is-size-6 has-text-weight-semibold is-hoverable {$location=="/Hardware"?"has-text-info noevent is-active":"has-text-grey-dark"}" href="/Hardware" on:click={toggleMenu} use:link >Hardware</a>
						<a class="navbar-item is-size-6 has-text-weight-semibold is-hoverable {$location=="/Settings"?"has-text-info noevent is-active":"has-text-grey-dark"}" href="/Settings" on:click={toggleMenu} use:link>Settings</a>
						<a class="navbar-item is-size-6 has-text-weight-semibold is-hoverable {$location=="/Charge"?"has-text-info noevent is-active":"has-text-grey-dark"}" href="/Charge" on:click={toggleMenu} use:link>Charge</a>
						<a class="navbar-item is-size-6 has-text-weight-semibold is-hoverable {$location=="/MQTT"?"has-text-info noevent is-active":"has-text-grey-dark"}" href="/MQTT" on:click={toggleMenu} use:link>MQTT</a>
						<a class="navbar-item is-size-6 has-text-weight-semibold is-hoverable {$location=="/Services"?"has-text-info noevent is-active":"has-text-grey-dark"}" href="/Services" on:click={toggleMenu} use:link>Services</a>
						<a class="navbar-item is-size-6 has-text-weight-semibold is-hoverable {$location=="/Vehicle"?"has-text-info noevent is-active":"has-text-grey-dark"}" href="/Vehicle" on:click={toggleMenu} use:link>Vehicle</a>
					</div>
				</div>
				
			</div>
		</div>
	</nav>
</div>