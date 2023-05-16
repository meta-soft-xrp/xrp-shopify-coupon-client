import { useEffect, useState, useContext } from "react";
import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  useBreakpointValue,
  FormControl,
  FormLabel,
  Icon,
  StackDivider,
  useColorModeValue,
  Image,
  useDisclosure,
  chakra,
  toast,
  useToast,
  Avatar,
  AvatarGroup,
  SkeletonText,
  SkeletonCircle,
  Skeleton,
  VStack,
  Divider,
  AvatarBadge,
  ButtonGroup,
  InputGroup,
  InputLeftAddon,
  Grid,
  GridItem,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  TableCaption,
  Thead,
  Th,
  Tfoot,
  FormHelperText,
  Alert,
  AlertIcon,
  InputRightAddon,
  Spinner,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { IoClose, IoAddOutline, IoCloseCircleOutline } from "react-icons/io5";
import { ResourcePicker } from "@shopify/app-bridge-react";
import NavBar from "../../components/navbar";

import useFilesStore from "../../store/files";
import useScriptsStore from "../../store/scripts";

import Upload from "../../components/upload";
import useLooksStore from "../../store/looks";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";
import { ShopContext } from "../../context";
import useCurrencyExchangeStore from "../../store/currency-exchage";

const renderSkeleton = () => {
  return (
    <Flex direction="column" width="100%">
      <Skeleton width="100%" height="40px">
        {" "}
      </Skeleton>
      <SkeletonText mt="4" noOfLines={1} spacing="4" />
      <br />
      <br />
      <Box>
        <SkeletonCircle size="20" />
        <SkeletonText mt="4" noOfLines={4} spacing="4" />
      </Box>
    </Flex>
  );
};

function CreateLooks(props) {
  const shop = useContext(ShopContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isResourcePickerOpen,
    onOpen: onResourcePickerOpen,
    onClose: onResourcePickerClose,
  } = useDisclosure();
  const looks = useLooksStore((state) => state.looks);
  const files = useFilesStore((state) => state.files);
  const getLooks = useLooksStore((state) => state.getLooks);
  const postLooks = useLooksStore((state) => state.postLooks);
  const destroyLooks = useLooksStore((state) => state.destroyLooks);
  const patchLooks = useLooksStore((state) => state.patchLooks);
  const scripts = useScriptsStore((state) => state.scripts);
  const postScripts = useScriptsStore((state) => state.postScripts);
  const getScripts = useScriptsStore((state) => state.getScripts);

  const currencyExchangeState = useCurrencyExchangeStore(
    (state) => state.currencyExchangeState
  );
  const getCurrencyExchangeState = useCurrencyExchangeStore(
    (state) => state.getCurrencyExchangeState
  );

  const { id = "" } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const colorMode = useColorModeValue("gray.100", "gray.700");
  const [looksName, setLooksName] = useState(props.looks.name);
  const [looksPrice, setLooksPrice] = useState(props.looks.price);
  const [lookXrpPrice, setLookXrpPrice] = useState();
  const [uploads, setUploads] = useState(props.looks.files || []);
  const [products, setProducts] = useState(props.looks.products || []);
  const [exchangeRate, setExchageRate] = useState();

  const [totalProductsPrice, setTotlaProductsPrice] = useState("");
  const onUploadWidgetClose = (data = []) => {
    setUploads([...uploads, ...data]);
    onClose();
  };
  console.log(currencyExchangeState.get.success.data.xrp);
  console.log(exchangeRate);
  const getExchangeRate = (data) => {
    console.log(data);
    setLookXrpPrice(
      (currencyExchangeState.get.success.data.xrp * data).toFixed(2)
    );
  };

  const onResourcePickerDone = (data = {}) => {
    console.log(data);
    setProducts([
      // ...products.filter(Boolean),
      ...data?.selection
        ?.map((d) => {
          return {
            title: d.title,
            image: (d.images[0] && d.images[0]?.originalSrc) || "",
            id: d.id,
            price: parseInt(d.variants[0]?.price) || 0,
          };
        })
        .filter(Boolean),
    ]);
    onResourcePickerClose();
    let productSum = 0;
    const result = data.selection.reduce((p, n) => {
      productSum = p + parseFloat(n.variants[0].price);
      return productSum;
    }, 0);
    setTotlaProductsPrice(result);
  };

  const getLooskById = async () => {
    if (id) {
      const data = await getLooks({ id });
      if (data) {
        setLooksName(data?.name);
        setUploads([...uploads, ...data?.medias]);
        setLooksPrice(data?.price);
        // console.log("asdf ", data.products);
        setProducts([
          ...products,
          ...data?.products.map((p) => ({
            id: p.admin_graphql_api_id,
            title: p.title,
            image: p?.image?.src,
            price: parseInt(p.variants[0]?.price) || 0,
          })),
        ]);
        let productSum = 0;
        const result = data.products.reduce((p, n) => {
          productSum = p + parseFloat(n.variants[0].price);
          return productSum;
        }, 0);
        setTotlaProductsPrice(result);
      }
    }
  };

  useEffect(() => {
    getLooskById();
    getCurrencyExchangeState();
  }, []);

  const removeUpload = (upload, index) => {
    uploads.splice(index, 1);
    setUploads([...uploads.filter(Boolean)]);
  };

  const removeProduct = (index) => {
    products.splice(index, 1);
    setProducts([...products.filter(Boolean)]);
    // console.log(products);
    let productSum = 0;
    const result = products.reduce((p, n) => {
      productSum = p + parseFloat(n.price);
      return productSum;
    }, 0);
    setTotlaProductsPrice(result);
  };

  const onDestroyLook = async (lookId) => {
    try {
      await destroyLooks(lookId);
      toast({
        title: `Look deleted!`,
        status: "success",
      });
      window.history.back();
    } catch (e) {
      toast({
        title: e.message || INTERNAL_SERVER_ERROR,
        status: "error",
      });
    }
  };
  const renderProducts = () => {
    return products.map((product, index) => (
      <Tr>
        <Td>
          <Image
            objectFit="contain"
            boxSize="50px"
            src={product.image}
            color={"yellow.500"}
          />
        </Td>
        <Td>{product.title}</Td>
        <Td isNumeric>{product.price}</Td>
        <Td textAlign={"center"}>
          <Icon
            as={IoClose}
            color={"red.500"}
            w={5}
            h={5}
            onClick={() => removeProduct(index)}
          />
        </Td>
      </Tr>
    ));
  };
  const renderLooks = () => {
    if (currencyExchangeState.get.loading) {
      return renderSkeleton();
    } else if (currencyExchangeState.get.failure.error) {
      <Box>
        <Flex direction="column" align="center">
          <VStack spacing="3">
            <Heading as="h1" size="md">
              {currencyExchangeState.get.failure.message}
            </Heading>
          </VStack>
          <br />
          <Divider />
          <br />
          <VStack spacing="3">
            <Button onClick={() => getCurrencyExchangeState()}>
              Try Again
            </Button>
          </VStack>
        </Flex>
      </Box>;
    } else {
      if (looks.get.loading) {
        return renderSkeleton();
      } else if (looks.get.failure.error) {
        return (
          <Box>
            <Flex direction="column" align="center">
              <VStack spacing="3">
                <Heading as="h1" size="md">
                  {looks.get.failure.message}
                </Heading>
              </VStack>
              <br />
              <Divider />
              <br />
              <VStack spacing="3">
                <Button onClick={() => getLooskById()}>Try Again</Button>
              </VStack>
            </Flex>
          </Box>
        );
      } else {
        const { data } = looks?.get?.success;
        return (
          <>
            <Stack spacing={4}>
              <Heading
                color={"gray.800"}
                lineHeight={1.1}
                fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              >
                {data && data.name ? data.name : "Create a shoppable curation"}
              </Heading>
              <Heading size="sm">
                Items in this curation can be bought by paying with XRP
              </Heading>
            </Stack>
            <Box mt={10}>
              <chakra.form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (id) {
                      await patchLooks({
                        id,
                        name: looksName,
                        price: looksPrice,
                        xrpPrice: lookXrpPrice,
                        medias: uploads,
                        products: products.map((product) => product.id),
                      });
                    } else {
                      await postLooks({
                        name: looksName,
                        price: looksPrice,
                        xrpPrice: lookXrpPrice,
                        medias: uploads,
                        products: products.map((product) => product.id),
                      });
                      try {
                        const scriptsOnStore = await getScripts(shop);
                        if (scriptsOnStore && scriptsOnStore.length) {
                          // already has a script tag, do nothing.
                        } else {
                          await postScripts(shop);
                        }
                        window.history.back();
                      } catch (e) {
                        window.history.back();
                      }
                    }
                    toast({
                      title: `Looks ${
                        id ? "updated" : "created"
                      } successfully!`,
                      status: "success",
                    });
                  } catch (e) {
                    toast({
                      title: e.message || INTERNAL_SERVER_ERROR,
                      status: "error",
                    });
                  }
                }}
                {...props}
              >
                <Stack spacing={4}>
                  <FormControl id="look-name">
                    <FormLabel>Give this curation a name</FormLabel>
                    <Input
                      placeholder="XRP Meetup Looks For Developers"
                      name="look_name"
                      type="text"
                      value={looksName}
                      onChange={(e) => setLooksName(e.target.value)}
                      required
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>
                      Add pictures for the kind of fashion and looks buyers can
                      create by shopping for items in this curation.
                    </FormLabel>
                    <AvatarGroup>
                      {uploads.map((upload, index) => (
                        <Avatar
                          key={(upload._name || upload.name) + index}
                          name={upload._name || upload.name}
                          src={upload._url || upload.url}
                          size="lg"
                          // size={useBreakpointValue({ base: 'md', md: 'lg' })}
                          position={"relative"}
                          zIndex={2}
                          _before={{
                            content: '""',
                            width: "full",
                            height: "full",
                            rounded: "full",
                            transform: "scale(1.125)",
                            bgGradient: "linear(to-bl, #7919FF,#7919FF)",
                            position: "absolute",
                            zIndex: -1,
                            top: 0,
                            left: 0,
                          }}
                        >
                          <AvatarBadge
                            boxSize="1.25em"
                            bg="#7919FF"
                            onClick={() => removeUpload(upload, index)}
                          >
                            <Icon
                              as={IoCloseCircleOutline}
                              color={"white.500"}
                              w={5}
                              h={5}
                            />
                          </AvatarBadge>
                        </Avatar>
                      ))}
                      <Avatar
                        onClick={onOpen}
                        size="lg"
                        bg={"#7919FF"}
                        _hover={{ bg: "#7919FF" }}
                        cursor="pointer"
                        icon={<IoAddOutline size="2em" color="white" />}
                        _before={{
                          content: '""',
                          width: "full",
                          height: "full",
                          rounded: "full",
                          transform: "scale(1.2)",
                          bgGradient: "linear(to-bl, #7919FF, #7919FF)",
                          position: "absolute",
                          zIndex: -1,
                          top: 0,
                          left: 0,
                        }}
                      ></Avatar>
                    </AvatarGroup>
                    <Upload isOpen={isOpen} onClose={onUploadWidgetClose} />
                  </FormControl>
                  <br />
                  <br />
                  <FormControl id="look-products">
                    <FormLabel>
                      Select products from your store that customers should shop
                      for to form the looks you made above.
                    </FormLabel>

                    <TableContainer pb={"10px"}>
                      <Table variant="striped" colorScheme={"gray"}>
                        <Thead>
                          <Tr>
                            <Th>Product Image</Th>
                            <Th>Product Name</Th>
                            <Th isNumeric>Product Price</Th>
                            <Th>Action</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {renderProducts()}
                          {totalProductsPrice ? (
                            <Tr>
                              <Td></Td>
                              <Td isNumeric fontWeight={"bold"}>
                                Total Product Price
                              </Td>
                              <Td isNumeric>
                                <Text size="14px" fontWeight={"bold"}>
                                  {totalProductsPrice}
                                </Text>
                              </Td>
                              <Td></Td>
                            </Tr>
                          ) : null}
                        </Tbody>
                      </Table>
                    </TableContainer>
                    <Button
                      fontFamily={"heading"}
                      bg={"gray.200"}
                      color={"gray.800"}
                      onClick={onResourcePickerOpen}
                    >
                      Link products +
                    </Button>
                    <ResourcePicker
                      onSelection={onResourcePickerDone}
                      onCancel={onResourcePickerClose}
                      selectMultiple
                      showVariants={false}
                      resourceType="Product"
                      open={isResourcePickerOpen}
                      initialSelectionIds={products
                        .map((product) => ({ id: product.id }))
                        .filter(Boolean)}
                    />
                  </FormControl>
                  <FormControl id="look-price">
                    <FormLabel>
                      Customers will be able to checkout and buy all of the
                      products in this curation by paying in XRP.
                      <br />
                      Add one price in USD for all of the above products
                    </FormLabel>
                    <InputGroup>
                      <InputLeftAddon children="USD" />
                      <Input
                        placeholder="100"
                        name="look_price"
                        type="text"
                        value={looksPrice}
                        onChange={(e) => {
                          setLooksPrice(e.target.value);
                        }}
                        onBlur={(e) => getExchangeRate(e.target.value)}
                        required
                      />
                      <InputRightAddon w={"50%"}>
                        {currencyExchangeState.get.loading ? (
                          <Spinner />
                        ) : (
                          `${lookXrpPrice ? lookXrpPrice : "0"} XRP`
                        )}
                      </InputRightAddon>
                    </InputGroup>
                    <FormHelperText>
                      The total number of XRP a customer has to pay to shop all
                      of the above products in this curation. Please add a
                      discounted price to encourage community.
                    </FormHelperText>
                  </FormControl>
                </Stack>
                <ButtonGroup mt={8} width="full">
                  {data && data.objectId ? (
                    <Button
                      isLoading={looks.destroy.loading}
                      onClick={() => onDestroyLook(data.objectId)}
                      isFullWidth
                      variant="ghost"
                      colorScheme="red"
                    >
                      Delete Curation
                    </Button>
                  ) : null}
                  <Button
                    isLoading={
                      looks.post.loading ||
                      looks.patch.loading ||
                      scripts.get.loading ||
                      scripts.post.loading
                    }
                    disabled={
                      looks.post.loading ||
                      looks.patch.loading ||
                      scripts.get.loading ||
                      scripts.post.loading
                    }
                    loadingText={`${id ? "Updating" : "Saving"} curation`}
                    type="submit"
                    fontFamily={"heading"}
                    isFullWidth
                    w={"full"}
                    bgGradient="linear(to-r, #c8ae01,#fc73a3)"
                    color={"white"}
                    _hover={{
                      bgGradient: "linear(to-r, #c8ae01,#fc73a3)",
                      boxShadow: "xl",
                    }}
                  >
                    {`${id ? "Update" : "Save"} curation`}
                  </Button>
                </ButtonGroup>
              </chakra.form>
            </Box>
          </>
        );
      }
    }
  };

  return (
    <>
      <NavBar />
      <Box position={"relative"}>
        <Container
          as={SimpleGrid}
          maxW={"7xl"}
          columns={{ base: 1, md: 1 }}
          spacing={{ base: 10, lg: 32 }}
          py={{ base: 10, sm: 15, lg: 20 }}
        >
          <Stack
            bg={"gray.50"}
            rounded={"xl"}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW="3xl"
            zIndex="9"
            margin="0 auto"
            width="100%"
          >
            {renderLooks()}
          </Stack>
        </Container>
        <Blur
          position={"absolute"}
          top={30}
          left={-10}
          style={{ filter: "blur(70px)" }}
        />
      </Box>
    </>
  );
}

export const Blur = (props) => {
  return (
    <Icon
      width={useBreakpointValue({ base: "100%", md: "40vw", lg: "30vw" })}
      zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
      height="560px"
      viewBox="0 0 528 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="71" cy="61" r="111" fill="#7919FF" />
      <circle cx="244" cy="106" r="139" fill="#28b86a" />
      <circle cy="291" r="139" fill="#7919FF" />
      <circle cx="80.5" cy="189.5" r="101.5" fill="#ff6719" />
      <circle cx="196.5" cy="317.5" r="101.5" fill="#7919FF" />
      <circle cx="70.5" cy="458.5" r="101.5" fill="#e24cff" />
      <circle cx="426.5" cy="-0.5" r="101.5" fill="#7919FF" />
    </Icon>
  );
};

CreateLooks.defaultProps = {
  looks: {
    name: "",
  },
};

export default CreateLooks;
