const Router = require('./router')

/**
 *  Links declaration in an array
 */
const links = [
    { name: "Gas Computey", url: "https://rooty-tooty-gas-computey.herokuapp.com/"},
    { name: "Yummi", url: "https://yummmi.herokuapp.com"},
    { name: "LinkedIn", url: "https://www.linkedin.com/in/bennypham/"},
    { name: "Github", url: "https://github.com/bennypham"},
]

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/**
 *  Returns JSON on /links path
 *  @param {Request} request
 */
function handleLinksPath(request) {
    const init = {
        headers: { 'content-type': 'application/json;charset=UTF-8' },
    }
    const body = JSON.stringify(links, null, 2)
    return new Response(body, init)
}

/**
 *  Handles the routing request for root and /links path
 *  @param {*} request
 */
async function handleRequest(request) {
    const route = new Router()

    // return /links path
    route.get('/links', request => handleLinksPath(request))

    const response = await route.route(request)
    return response
}
