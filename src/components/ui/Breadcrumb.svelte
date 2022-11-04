<script>
	import { link, location } from "svelte-spa-router"
	import {onMount} from 'svelte'
	let level = 0
	let links = []
	let summedlink = ""

	function sumlink(link) {
		summedlink = summedlink + "/" + link
		return summedlink
	}

	function buildBreadCrumb(loc) {
		
		links = loc.split("/")
		links.shift() // remove first empty element
		level = links.length
	}
	onMount(()=>{ 
		buildBreadCrumb($location)
		console.log($location)
	})
		
</script>

<nav class="breadcrumb has-succeeds-separator is-right" aria-label="breadcrumbs">
	<ul>
		<li class={ $location === "/" ? "is-active has-text-primary" : "" }>
			<a href="/" use:link>main</a>
		</li>
	 
	  	{#each links as link, i }
			<li class={ i == level - 1 ? "is-active is-primary":"is-info"}>
				<a href={"/#" + sumlink(link)}> {link} </a>
			</li>
	  {/each}
	</ul>
</nav>