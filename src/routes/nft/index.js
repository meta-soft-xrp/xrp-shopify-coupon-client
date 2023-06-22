import React from 'react';
import NavBar from "../../components/navbar";
import useNFTStore from "../../store/nft";
import { Box, Button, Container, Heading, Input, Stack, StackDivider, Text, useToast } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'




const NFTRoute = () => {

    const nftState = useNFTStore((state) => state.nftState);
    const postNFTState = useNFTStore((state) => state.postNFTState);
    const getNFTState = useNFTStore((state) => state.getNFTState);
    const createSellOffer = useNFTStore((state) => state.createSellOffer);
    const toast = useToast();


    const handleCreateNFT = (event) => {
        event.preventDefault();
        const form = event.target;
        const seed = process.env.REACT_APP_XRP_NFT_ACCOUNT_SEED;
        const uri = form.uri.value;
        const transferFee = form.transferFee.value;
        const flags = form.flags.value;

        postNFTState(seed, uri, transferFee, flags);
        form.reset();

    }

    // const handleGetNFT = (event) => {
    //     event.preventDefault();
    //     const seed = process.env.REACT_APP_XRP_NFT_ACCOUNT_SEED;

    //     getNFTState(seed)
    // }

    if (nftState.post.success.ok) {
        toast({
            title: "NFT created successfully",
            status: "success",
        });
    }

    if (nftState.offer.success.ok) {
        toast({
            title: "NFToken offer created successfully",
            status: "success",
        });
    }


    const handleCrateSellOffer = (event) => {
        event.preventDefault();
        const form = event.target;
        const seed = process.env.REACT_APP_XRP_NFT_ACCOUNT_SEED;
        const tokenID = form.tokenID.value;
        const flags = form.flags.value;
        const expiration = form.expiration.value;
        const destination = form.destination.value;
        const amount = form.amount.value;

        createSellOffer(seed, tokenID, amount, flags, destination, expiration);

        form.reset();
    };

    let length = 0;
    let NFTokenID = ""
    let token = ""
    length = nftState?.post?.success?.data?.result?.account_nfts.length;


    if (nftState?.post?.success?.data?.result?.account_nfts.length) {
        NFTokenID = nftState?.post?.success?.data?.result?.account_nfts[length - 1]?.NFTokenID;
        token = nftState?.post?.success?.data?.result?.account_nfts[length - 1]
    }


    return (
        <>
            <NavBar></NavBar>
            <Container maxW={"7xl"} p={[12, 6]} bg="#f6f6f7" textAlign={"left"}>

                <Box as="section" maxW="5xl" mx="auto">
                    <Text fontSize={"24px"} fontWeight={"semibold"}>Create <Text as="span" color='blue.600' fontWeight={"bold"}>NFTs</Text> to gift your customers</Text>
                </Box>

                <Tabs maxW="5xl" mx="auto" mt={"24px"}>
                    <TabList>
                        <Tab>Create</Tab>
                        <Tab>Transfer</Tab>

                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <Box bg="white" maxW="5xl" mx="auto" borderRadius={10} p={5} mt={'24px'} boxShadow="md">
                                <Text mb='4px' align={"center"} mt={'8px'} size="xl" fontWeight="bold" >CREATE NFTs</Text>
                                <form onSubmit={handleCreateNFT}>
                                    {/* <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >XRP ACCOUNT SEED</Text>
                                    <Input
                                        name='seed'
                                        placeholder='Type your XRP Seed'
                                        size='sm'
                                        required={true}
                                    /> */}
                                    <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >TOKEN URI</Text>
                                    <Input
                                        name='uri'
                                        placeholder='Type your token URI'
                                        size='sm'
                                        required={true}
                                        defaultValue={"ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi"}
                                    />
                                    <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >TRANSFER FEE</Text>
                                    <Input
                                        name='transferFee'
                                        placeholder='Enter a transfer fee'
                                        size='sm'
                                        required={true}
                                        defaultValue={1}
                                    />
                                    <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >FLAGS</Text>
                                    <Input
                                        name='flags'
                                        placeholder='Type number of flags'
                                        size='sm'
                                        required={true}
                                        defaultValue={8}
                                        disabled={true}
                                    />

                                    <Button isLoading={nftState.post.loading} type='submit' colorScheme={"messenger"} variant='solid' mt={'10px'}>
                                        {nftState.post.loading ? "Loading" : "Create NFT"}
                                    </Button>
                                </form>
                            </Box>

                            {/* <Box bg="white" maxW="5xl" mx="auto" borderRadius={10} p={5} mt={'24px'} boxShadow="md">
                                <form onSubmit={handleGetNFT}>
                                    <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >XRP ACCOUNT SEED</Text>
                                    <Input
                                        name='seed'
                                        placeholder='Type your XRP Seed'
                                        size='sm'
                                        required={true}
                                    />

                                    <Button isLoading={nftState.get.loading} type='submit' colorScheme={"messenger"} variant='solid' mt={'10px'}>
                                        {nftState.get.loading ? "Loading" : "Get NFTs of your account"}
                                    </Button>
                                </form>
                            </Box> */}

                            {nftState.post.success.ok ? <Box bg="white" maxW="5xl" mx="auto" borderRadius={10} p={5} mt={'24px'} boxShadow="md">
                                <Heading size='xs' mb={'20px'}>
                                    Created tokens for account : {nftState.post.success.data?.result?.account}
                                </Heading>
                                <Stack divider={<StackDivider />} spacing='4'>

                                    <Box key={token.NFTokenID}>
                                        <Text pt='2' fontSize='sm'>
                                            Serial :  {token.nft_serial}
                                        </Text>
                                        <Text pt='2' fontSize='sm'>
                                            Issuer :  {token.Issuer}
                                        </Text>
                                        <Text pt='2' fontSize='sm'>
                                            NFToken ID:  {token.NFTokenID}
                                        </Text>
                                        <Text pt='2' fontSize='sm'>
                                            Flags :  {token.Flags}
                                        </Text>
                                        <Text pt='2' fontSize='sm'>
                                            Transfer Fee :  {token.TransferFee}
                                        </Text>
                                        <Text pt='2' fontSize='sm'>
                                            Token URI :  {token.URI}
                                        </Text>
                                    </Box>

                                </Stack>
                            </Box> : ""}



                            {nftState.get.success.ok ? <Box bg="white" maxW="5xl" mx="auto" borderRadius={10} p={5} mt={'24px'} boxShadow="md">
                                <Heading size='xs' mb={'20px'}>
                                    Tokens for account : {nftState.get.success.data?.result?.account}
                                </Heading>
                                <Stack divider={<StackDivider />} spacing='4'>
                                    {nftState.get.success.data?.result?.account_nfts?.map(nfts =>
                                        <Box key={nfts.NFTokenID}>
                                            <Text pt='2' fontSize='sm'>
                                                Serial :  {nfts.nft_serial}
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Issuer :  {nfts.Issuer}
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                NFToken ID:  {nfts.NFTokenID}
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Flags :  {nfts.Flags}
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Transfer Fee :  {nfts.TransferFee}
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Token URI :  {nfts.URI}
                                            </Text>
                                        </Box>)}

                                </Stack>
                            </Box> : ""}
                        </TabPanel>



                        <TabPanel>
                            <Box bg="white" maxW="5xl" mx="auto" borderRadius={10} p={5} mt={'24px'} boxShadow="md">
                                <Text mb='4px' align={"center"} mt={'8px'} size="xl" fontWeight="bold" >CREATE A SELL OFFER</Text>
                                <form onSubmit={handleCrateSellOffer}>
                                    {/* <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >XRP ACCOUNT SEED</Text>
                                    <Input
                                        name='seed'
                                        placeholder='Type your XRP Seed'
                                        size='sm'
                                        required={true}
                                    /> */}
                                    <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >NFT TOKEN ID</Text>
                                    <Input
                                        name='tokenID'
                                        placeholder='Type your NFToken ID'
                                        size='sm'
                                        required={true}
                                        defaultValue={NFTokenID}

                                    />
                                    <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >AMOUNT</Text>
                                    <Input
                                        name='amount'
                                        placeholder='Enter an amount in drops (1000000 drops = 1 xrp)'
                                        size='sm'
                                        required={true}
                                        defaultValue={0}
                                    />
                                    <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >FLAGS</Text>
                                    <Input
                                        name='flags'
                                        placeholder='Type number of flags'
                                        size='sm'
                                        required={true}
                                        defaultValue={1}
                                        disabled={true}
                                    />
                                    <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >EXPIRATION</Text>
                                    <Input
                                        name='expiration'
                                        placeholder='Type number of expiration days'
                                        size='sm'
                                        required={true}
                                    />
                                    <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >DESTINATION</Text>
                                    <Input
                                        name='destination'
                                        placeholder='Type the destination account '
                                        size='sm'
                                        required={true}
                                    />

                                    <Button isLoading={nftState.offer.loading} type='submit' colorScheme={"messenger"} variant='solid' mt={'10px'}>
                                        {nftState.offer.loading ? "Loading" : "CREATE SELL OFFER"}
                                    </Button>
                                </form>
                            </Box>


                            {nftState.offer.success.ok ? <Box bg="white" maxW="5xl" mx="auto" borderRadius={10} p={5} mt={'24px'} boxShadow="md">
                                <Heading size='xs' mb={'20px'} fontWeight={"semibold"}>
                                    Created offers for NFToken ID : {nftState.offer.success.data?.result?.nft_id}
                                </Heading>
                                <Stack divider={<StackDivider />} spacing='4'>
                                    {nftState.offer.success.data?.result?.offers?.map(offer =>
                                        <Box key={offer.NFTokenID}>
                                            <Text pt='2' fontSize='sm'>
                                                Offer Index :  <Text as={'span'} textColor={"green.600"} fontWeight={"bold"}>{offer.nft_offer_index}</Text>
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Owner :  {offer.owner}
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Amount:  {offer.amount}
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Destination:  {offer.destination}
                                            </Text>
                                        </Box>)}
                                    <Text fontStyle={"italic"} as='u' cursor={'pointer'}>
                                        <a href={nftState.offer.success.data?.payload?.next?.always} target='_blank' rel="noreferrer">Offer Accept QR </a>
                                    </Text>
                                </Stack>
                            </Box> : ""}
                        </TabPanel>
                    </TabPanels>
                </Tabs>

            </Container>

        </>
    );
};

export default NFTRoute;