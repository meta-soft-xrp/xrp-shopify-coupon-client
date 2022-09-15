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
  Divider
} from "@chakra-ui/react";
import NavBar from "../../components/navbar";

const TransactionRoute = () => {
  return (
    <>
      <NavBar />
      <Container
        maxW={"7xl"}
        p={[12, 6]}
        h="100vh"
        bg="#f6f6f7"
        textAlign={"left"}
      >
        <Box bg="white" width={"5xl"} m="auto" p={5} borderRadius="10px">
            <VStack spacing={2} align="stretch">
                <Box>
                <Text size="xl" fontWeight="bold">XRP Transaction Details</Text>
                <Divider borderColor='gray.200' />
                </Box>
            </VStack>
          <TableContainer p="5">
            <Table variant={"simple"}>
              <Thead>
                <Tr>
                  <Th>SL No</Th>
                  <Th>into</Th>
                  <Th isNumeric>multiply by</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td isNumeric>25.4</Td>
                </Tr>
                <Tr>
                  <Td>feet</Td>
                  <Td>centimetres (cm)</Td>
                  <Td isNumeric>30.48</Td>
                </Tr>
                <Tr>
                  <Td>yards</Td>
                  <Td>metres (m)</Td>
                  <Td isNumeric>0.91444</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  );
};

export default TransactionRoute;
