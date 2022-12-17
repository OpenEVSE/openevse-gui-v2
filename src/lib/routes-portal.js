import { wrap }         from 'svelte-spa-router/wrap'
import Portal           from '../routes/Portal.svelte'
import About            from '../routes/About.svelte'
import NotFound         from '../routes/NotFound.svelte'

export const routes = {
    // Exact path
    '/': wrap({ component: Portal }),
    '/configuration/about': wrap({ component: About}),
    // Catch-all
    // This is optional, but if present it must be the last
    '*': NotFound,
}