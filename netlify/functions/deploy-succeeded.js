exports.handler = async (request) => {
  return {
    headers: {
      "Content-Security-Policy": "frame-ancestors https://*.myshopify.com https://admin.shopify.com",
    },
  };
};