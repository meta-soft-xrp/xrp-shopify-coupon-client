import {
  Box,
  Container,
  Heading,
  Table,
  TableContainer,
  Th,
  Thead,
  Tr,
  Tbody,
  Td,
  VStack,
  Text,
  Divider,
  SkeletonText,
  Link,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import NavBar from "../../components/navbar";
import { ShopContext } from "../../context";
import useTransactionStore from "../../store/transaction";

const TransactionRoute = () => {
  const shop = useContext(ShopContext);
  const transactionState = useTransactionStore(
    (state) => state.transactionState
  );
  const getTransactionState = useTransactionStore(
    (state) => state.getTransactionState
  );

  useEffect(async () => {
    getTransactionState(shop);
  }, []);

  console.log(transactionState.get.success.data?.result?.transactions, "transactions")

  if (transactionState.get.success.data.length === 0) {
    return (
      <>
        <NavBar />
        <Container
          maxW={"7xl"}
          p={[12, 6]}
          minH={"100vh"}
          bg="#f6f6f7"
          textAlign={"left"}
        >
          <Box padding="6" boxShadow="lg" bg="white">
            <SkeletonText mt="4" noOfLines={4} spacing="4" />
          </Box>
        </Container>
      </>
    );
  } else {
    return (
      <>
        <NavBar />
        <Container
          maxW={"7xl"}
          p={[12, 6]}
          bg="#f6f6f7"
          textAlign={"left"}
        >
          <Box bg="white" width={"5xl"} m="auto" p={5} borderRadius="10px">
            <VStack spacing={2} align="stretch">
              <Box>
                <Text size="xl" fontWeight="bold">
                  XRP Transaction Details
                </Text>
                <Divider borderColor="gray.200" />
              </Box>
            </VStack>

            <TableContainer p="5">
              <Table variant={"simple"}>
                <Thead>
                  <Tr>
                    <Th>Account</Th>
                    {/* <Th isNumeric>Amount</Th> */}
                    <Th>Ledger Index</Th>
                    <Th>Fee</Th>
                    <Th>Transaction Ref</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactionState.get.success.data?.result?.transactions.map(
                    (details) => (
                      // <Text>{details.tx.Account}</Text>
                      <Tr>
                        <Td>{details.tx.Account}</Td>

                        {/* --------- There is no amount field i tx----------------- */}

                        {/* <Td isNumeric>
                          {window.xrpl.dropsToXrp(details.tx.Amount)}
                        </Td> */}
                        <Td>{details.tx.inLedger}</Td>
                        <Td>{details.tx.Fee}</Td>
                        <Td>
                          <Link
                            color="teal"
                            target="_blank"
                            href={`${process.env.REACT_APP_XRP_TRANSACTION_REFFERENCE}transactions/${details.tx.hash}`}
                          >
                            {details.tx.hash}
                          </Link>
                        </Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </>
    );
  }
};

export default TransactionRoute;
