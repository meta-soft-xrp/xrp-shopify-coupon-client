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
  const [isEmbed, setIsEmbed] = useState(false);
  useEffect(() => {
    const { code, session, hmac, embed, shop = '' } = parseQuery(window.location.search);
    window.lookbook = (parseQuery(window.location.search));
    if (session) {
      setShopifySessionAvailable(true);
    } else if (code) {
      setShopifySessionAvailable(false);
      window.location.replace(`${process.env.REACT_APP_SERVER_URL}/shopify/callback${document.location.search}`)
    } else if (hmac){
      setShopifySessionAvailable(false);
      window.location.replace(`${process.env.REACT_APP_SERVER_URL}/shopify${document.location.search}`)
    } else if (embed) {
      setIsEmbed(true);
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
  } 
  // else if (code || hmac) {
  //   return (	
  //     <Flex alignItems="flex-start" flexDirection="row">
  //       <Skeleton> 
  //         <Box></Box>
  //       </Skeleton>
  //       <Flex direction="column" width="90%" marginLeft="5">
  //         <Skeleton width="100%" height="40px"> 
  //       </Skeleton>
  //       <br />
  //       <Skeleton width="100%" height="20px"> 
  //       </Skeleton>
  //       <br />
  //       <Skeleton width="100%" height="20px"> 
  //       </Skeleton>
  //       <br />
  //       <Skeleton width="100%" height="20px"> 
  //       </Skeleton>
  //       </Flex>
  //     </Flex>
  //   )
  // } 
  else {
    return <Authorize />
  }
}

export default App;
