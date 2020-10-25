const Router = require('./router')

/**
 *  Links in an array declaration
 *  User Avatar link declaration
 *  User name declaration
 *  Social links in an array declaration
 *  Title declaration
 *  Colors array declaration
 */
const links = [
    { name: "Gas Computey", url: "https://rooty-tooty-gas-computey.herokuapp.com/"},
    { name: "Yummi", url: "https://yummmi.herokuapp.com"},
    { name: "Github", url: "https://github.com/bennypham"},
]
const avatarLink = "https://raw.githubusercontent.com/bennypham/bennypham.github.io/master/Profile.jpg"
const name = "Benny Pham"
const socialLinks = [
    { url: "https://www.yelp.com/user_details?userid=I1cTbh9H1Flgu31MHBx4aA", svg: "https://simpleicons.org/icons/yelp.svg"},
    { url: "https://www.linkedin.com/in/bennypham/", svg: "https://simpleicons.org/icons/linkedin.svg"},
    { url: "https://twitter.com/bennyyphamm", svg: "https://simpleicons.org/icons/twitter.svg"},
]
const title = "Hello! Don't Leave Me!"
const backgroundColors = [
    "#A0AEC0",
    "#F56565",
    "#ED8936",
    "#ECC94B",
    "#48BB78",
    "#38B2AC",
    "#4299E1",
    "#667EEA",
    "#9F7AEA",
    "#ED64A6"
]

addEventListener('fetch', event => {
    event.respondWith(handleRoute(event.request))
})
/**
 *  Custom class to pass in links array into static HTML
 *  Will target the div#links selector and add in a new
 *  'a' for each link in API
 *  For each link, append the link url and name in the corresponding
 *  places for each 'a'
 *  Element method "append" source:
 *  https://developers.cloudflare.com/workers/runtime-apis/html-rewriter
 */
class LinksTransformer {
    constructor(links) {
        this.links = links
    }

    async element(element) {
        this.links.forEach(link => {
            element.append(`<a href=${link.url}>${link.name}</a>`, {
                html: true
            })
        })
    }
}
/**
 *  Custom class to remove display: none attribute and pass into static HTML
 *  Will target the selector you pass in and remove attribute
 *  Element method "removeAttribute" source:
 *  https://developers.cloudflare.com/workers/runtime-apis/html-rewriter
 */
class RemoveDisplayTransformer {
    constructor(display) {
        this.display = display
    }

    async element(element) {
        element.removeAttribute(this.display)
    }
}
/**
 *  Custom class to pass in avatar picture
 *  Will target the img#avatar selector and allow to add image
 *  If attribute is not available, create attribute and apply value
 *  Element method "setAttribute" source:
 *  https://developers.cloudflare.com/workers/runtime-apis/html-rewriter
 */
class AvatarTransformer {
    constructor(attribute, avatarLink) {
        this.attribute = attribute
        this.avatarLink = avatarLink
    }

    async element(element) {
        element.setAttribute(this.attribute, this.avatarLink)
    }
}
/**
 *  Custom class to pass name into static HTML
 *  Will target the h1#name selector and add in the name
 *  Element method "setInnerContent" source:
 *  https://developers.cloudflare.com/workers/runtime-apis/html-rewriter
 */
class UsernameTransformer {
    constructor(name) {
        this.name = name
    }

    async element(element) {
        element.setInnerContent(this.name)
    }
}
/**
 *  Custom class to pass in social links into static HTML
 *  Will target the div#social selector and add in a new
 *  'a' for each link with their own svg
 *  For each link, append the link url and svg in the corresponding places
 *  Element method "append" source:
 *  https://developers.cloudflare.com/workers/runtime-apis/html-rewriter
 */
class SocialLinksTransformer {
    constructor(socialLinks) {
        this.socialLinks = socialLinks
    }

    async element(element) {
        this.socialLinks.forEach(socialLink => {
          element.append(`<a href=${socialLink.url}><img src=${socialLink.svg}></img></a>`, {
            html: true
          })
        })
    }
}
/**
 *  Custom class to update title field in static HTML
 *  Will target the title selector and add in the new title
 *  Element method "setInnerContent" source:
 *  https://developers.cloudflare.com/workers/runtime-apis/html-rewriter
 */
class TitleTransformer {
    constructor(title) {
        this.title = title
    }

    async element(element) {
        element.setInnerContent(this.title)
    }
}

class BackgroundColorTransformer {
    constructor(attribute, color) {
        this.attribute = attribute
        this.color = color
    }

    async element(element) {
        element.setAttribute(this.attribute, this.color)
    }
}

/**
 *  Returns JSON on /links path
 *  Used example from
 *  https://github.com/cloudflare/worker-template-router
 *  https://developers.cloudflare.com/workers/examples/return-json
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
 *  Retrieves a static HTML page on root path
 *  Enchanced using HTMLRewriter on the div#links, div#profile
 *  img#avatar, and h1#name, div#social
 *  Used example for content-type, HTMLRewriter
 *  https://developers.cloudflare.com/workers/examples/return-html
 *  https://developers.cloudflare.com/workers/tutorials/localize-a-website
 *  https://developers.cloudflare.com/workers/runtime-apis/html-rewriter
 *  @param {*} request
 */
async function handleRootPath(request) {
    const init = {
        headers: { 'content-type': 'text/html;charset=UTF-8'}
    }

    const body = await fetch("https://static-links-page.signalnerve.workers.dev", init)

    const newHTML = new HTMLRewriter()
      .on("div#links", new LinksTransformer(links))
      .on("div#profile", new RemoveDisplayTransformer("style"))
      .on("img#avatar", new AvatarTransformer("src", avatarLink))
      .on("h1#name", new UsernameTransformer(name))
      .on("div#social", new RemoveDisplayTransformer("style"))
      .on("div#social", new SocialLinksTransformer(socialLinks))
      .on("title", new TitleTransformer(title))
      .on("body", new RemoveDisplayTransformer("class"))
      .on("body", new BackgroundColorTransformer("style", `background-color:${backgroundColors[Math.floor(Math.random() * backgroundColors.length)]}`))
      .transform(body)

    return newHTML
}

/**
 *  Handles the routing request for root and /links path
 *  Used example of routing from
 *  https://github.com/cloudflare/worker-template-router
 *  @param {*} request
 */
async function handleRoute(request) {
    const route = new Router()

    // return /links path
    route.get("/links", request => handleLinksPath(request))
    // return root path
    route.get("/", request => handleRootPath(request))

    const response = await route.route(request)
    return response
}
