<script>
	import { link, location } from "svelte-spa-router"
	import Fa from 'svelte-fa/src/fa.svelte'
	import { faHome } from '@fortawesome/free-solid-svg-icons/index.js'
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

<nav class="breadcrumb is-left" aria-label="breadcrumbs">
	<ul>
		<li class={ $location === "/" ? "is-active" : "" }>
			<a href="/" use:link><Fa class="mt-1" icon={faHome} /></a>
		</li>
	 
	  	{#each links as link, i }
			<li class={ i == level - 1 ? "is-active":""}>
				<a href={"/#" + sumlink(link)}> {link} </a>
			</li>
	  {/each}
	</ul>
</nav>