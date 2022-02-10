import { useState, useEffect} from "react";
import {
	Flex,
  Skeleton,
  Box
} from "@chakra-ui/react"
import {
  Navigate
} from "react-router-dom";
import NavBar from "./components/navbar";
import LooksRoute from "./routes/looks";
import { parseQuery } from "./utils/url";
import Authorize from "./routes/shopify/Authorize";

function App() {
  const [shopifySessionAvailable, setShopifySessionAvailable] = useState(false);
  const [shopifyHmacAvailable, setShopifyHmacAvailable] = useState(false);
  const [shopifyCodeAvailable, setShopifyCodeAvailable] = useState(false);

  const [isEmbed, setIsEmbed] = useState(false);
  useEffect(() => {
    const { code, session, hmac, embed, shop = '' } = parseQuery(window.location.search);
    window.lookbook = (parseQuery(window.location.search));
    if (session) {
      setShopifySessionAvailable(true);
      setShopifyHmacAvailable(false);
      setShopifyCodeAvailable(false);
    } else if (code) {
      setShopifySessionAvailable(false);
      setShopifyHmacAvailable(false);
      setShopifyCodeAvailable(true);
      window.location.replace(`${process.env.REACT_APP_SERVER_URL}/shopify/callback${document.location.search}`)
    } else if (hmac){
      setShopifySessionAvailable(false);
      setShopifyHmacAvailable(true);
      setShopifyCodeAvailable(false)
      window.location.replace(`${process.env.REACT_APP_SERVER_URL}/shopify${document.location.search}`)
    } else if (embed) {
      setIsEmbed(true);
      setShopifySessionAvailable(false);
      setShopifyHmacAvailable(false);
      setShopifyCodeAvailable(false)
    }
  }, []);
  
  if (shopifySessionAvailable) {
    return (
      <>
        <NavBar />
        <LooksRoute />
      </>
    );
  } else if (isEmbed) {
    return <Navigate to="/embed" replace />
  } else if (shopifyHmacAvailable || shopifyCodeAvailable) {
    return (	
      <Flex alignItems="flex-start" flexDirection="row">
        <Skeleton> 
          <Box></Box>
        </Skeleton>
        <Flex direction="column" width="90%" marginLeft="5">
          <Skeleton width="100%" height="40px"> 
        </Skeleton>
        <br />
        <Skeleton width="100%" height="20px"> 
        </Skeleton>
        <br />
        <Skeleton width="100%" height="20px"> 
        </Skeleton>
        <br />
        <Skeleton width="100%" height="20px"> 
        </Skeleton>
        </Flex>
      </Flex>
    )
  } else {
    return <Authorize />
  }
}

export default App;
