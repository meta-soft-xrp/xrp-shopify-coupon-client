exports.handler = async function(event, context) {
	console.log(event.headers)
	return {
		headers: { "Content-Security-Policy": "frame-ancestors https://shop.myshopify.com https://admin.shopify.com" }
	}
}