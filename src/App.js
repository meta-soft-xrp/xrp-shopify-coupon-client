import { useState, useEffect} from "react";
import {
	Flex,
  Skeleton,
  Box
} from "@chakra-ui/react"
import NavBar from "./components/navbar";
import LooksRoute from "./routes/looks";
import { parseQuery } from "./utils/url";

function App() {
  const [shopifySessionAvailable, setShopifySessionAvailable] = useState(false);
  useEffect(() => {
    const { code, session, hmac } = parseQuery(window.location.search);
    if (session) {
      setShopifySessionAvailable(true);
    } else if (code) {
      setShopifySessionAvailable(false);
      console.log("COMING TO /shopify/callback ", document.location.search)
      window.location.replace(`${process.env.REACT_APP_SERVER_URL}/shopify/callback${document.location.search}`)
    } else if (hmac){
      console.log("COMING TO /shopify ", document.location.search)
      setShopifySessionAvailable(false);
      window.location.replace(`${process.env.REACT_APP_SERVER_URL}/shopify${document.location.search}`)
    }
  }, []);

  if (shopifySessionAvailable) {
    return (
      <>
        <NavBar />
        <LooksRoute />
      </>
    );
  } else {
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
  }
}

export default App;
