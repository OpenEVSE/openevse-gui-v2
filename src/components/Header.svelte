<script>
  import logo from '../assets/logo.png';
  let isBurgerActive = false;
  function toggleBurger() {
		isBurgerActive = !isBurgerActive;
	}
</script>
<style> 
.burger { margin-left: auto; 
		  margin-right: 0;
		}

</style>
<div class="container">
	<nav class="navbar is-white" aria-label="main navigation">
		<div class="navbar-brand">
			<a href="/">
				<img src={logo} class="" alt="logo"/>
			</a>
				<div role="button" class="navbar-burger burger  {isBurgerActive ? 'is-active' : ''}" aria-label="menu" aria-expanded="false" data-target="evsenav" on:click={toggleBurger}>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</div>
		</div>
	
		<div id="evsenav" class="navbar-menu {isBurgerActive ? 'is-active' : ''}">

	
			<div class="navbar-start">

				<a class="navbar-item is-size-6 has-text-weight-semibold is-hoverable has-text-grey-dark" href="/">Main</a>
				<a class="navbar-item is-size-6 has-text-weight-semibold is-hoverable has-text-grey-dark" href="#Advanced">Advanced</a>
				<div class="navbar-item has-dropdown is-hoverable">
					<a class="navbar-item is-size-6 has-text-weight-semibold has-text-grey-dark" href="#Config">Configuration</a>
					<div class="navbar-dropdown">
						<a class="navbar-item is-size-6 has-text-weight-semibold is-hoverable has-text-grey-dark" href="#Hardware">Hardware</a>
						<a class="navbar-item is-size-6 has-text-weight-semibold is-hoverable has-text-grey-dark" href="#Settings">Settings</a>
						<a class="navbar-item is-size-6 has-text-weight-semibold is-hoverable has-text-grey-dark" href="#Charge">Charge</a>
						<a class="navbar-item is-size-6 has-text-weight-semibold is-hoverable has-text-grey-dark" href="#MQTT">MQTT</a>
						<a class="navbar-item is-size-6 has-text-weight-semibold is-hoverable has-text-grey-dark" href="#Services">Services</a>
						<a class="navbar-item is-size-6 has-text-weight-semibold is-hoverable has-text-grey-dark" href="#Vehicle">Vehicle</a>
					</div>
				</div>
				
			</div>
		</div>
	</nav>
</div>