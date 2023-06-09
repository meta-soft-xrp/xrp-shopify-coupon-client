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
        const seed = form.seed.value;
        const uri = form.uri.value;
        const transferFee = form.transferFee.value;
        const flags = form.flags.value;

        postNFTState(seed, uri, transferFee, flags);
        form.reset();

    }

    const handleGetNFT = (event) => {
        event.preventDefault();
        const form = event.target;
        const seed = form.seed.value;

        getNFTState(seed)
    }

    if (nftState.post.success.ok) {
        toast({
            title: "NFT create success",
            status: "success",
        });
    }

    const handleCrateSellOffer = (event) => {
        event.preventDefault();
        const form = event.target;
        const seed = form.seed.value;
        const tokenID = form.tokenID.value;
        const flags = form.flags.value;
        const expiration = form.expiration.value;
        const destination = form.destination.value;
        const amount = form.amount.value;

        createSellOffer(seed, tokenID, amount, flags, destination, expiration);
    };


    console.log(nftState.post.success.data?.result)

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
                                    <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >XRP ACCOUNT SEED</Text>
                                    <Input
                                        name='seed'
                                        placeholder='Type your XRP Seed'
                                        size='sm'
                                        required={true}
                                    />
                                    <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >TOKEN URI</Text>
                                    <Input
                                        name='uri'
                                        placeholder='Type your token URI'
                                        size='sm'
                                        required={true}
                                    />
                                    <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >TRANSFER FEE</Text>
                                    <Input
                                        name='transferFee'
                                        placeholder='Enter a transfer fee'
                                        size='sm'
                                        required={true}
                                    />
                                    <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >FLAGS</Text>
                                    <Input
                                        name='flags'
                                        placeholder='Type number of flags'
                                        size='sm'
                                        required={true}
                                    />

                                    <Button isLoading={nftState.post.loading} type='submit' colorScheme={"messenger"} variant='solid' mt={'10px'}>
                                        {nftState.post.loading ? "Loading" : "Create NFT"}
                                    </Button>
                                </form>
                            </Box>

                            <Box bg="white" maxW="5xl" mx="auto" borderRadius={10} p={5} mt={'24px'} boxShadow="md">
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
                            </Box>

                            {nftState.post.success.ok ? <Box bg="white" maxW="5xl" mx="auto" borderRadius={10} p={5} mt={'24px'} boxShadow="md">
                                <Heading size='xs' mb={'20px'}>
                                    Created tokens for account : {nftState.post.success.data?.result?.account}
                                </Heading>
                                <Stack divider={<StackDivider />} spacing='4'>
                                    {nftState.post.success.data?.result?.account_nfts?.map(nfts =>
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
                                    <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >XRP ACCOUNT SEED</Text>
                                    <Input
                                        name='seed'
                                        placeholder='Type your XRP Seed'
                                        size='sm'
                                        required={true}
                                    />
                                    <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >NFT TOKEN ID</Text>
                                    <Input
                                        name='tokenID'
                                        placeholder='Type your NFToken ID'
                                        size='sm'
                                        required={true}
                                    />
                                    <Text mb='4px' mt={'8px'} size="xl" fontWeight="bold" >AMOUNT</Text>
                                    <Input
                                        name='amount'
                                        placeholder='Enter an amount in drops'
                                        size='sm'
                                        required={true}
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
                                        placeholder='Type number of expiration days'
                                        size='sm'
                                        required={true}
                                    />

                                    <Button isLoading={nftState.post.loading} type='submit' colorScheme={"messenger"} variant='solid' mt={'10px'}>
                                        {nftState.post.loading ? "Loading" : "CREATE SELL OFFER"}
                                    </Button>
                                </form>
                            </Box>


                            {nftState.post.success.ok ? <Box bg="white" maxW="5xl" mx="auto" borderRadius={10} p={5} mt={'24px'} boxShadow="md">
                                <Heading size='xs' mb={'20px'}>
                                    Created offers for NFTokenn ID : {nftState.post.success.data?.result?.nft_id}
                                </Heading>
                                <Stack divider={<StackDivider />} spacing='4'>
                                    {nftState.post.success.data?.result?.offers?.map(offer =>
                                        <Box key={offer.NFTokenID}>
                                            <Text pt='2' fontSize='sm'>
                                                Offer Index :  {offer.nft_offer_index}
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Owner :  {offer.owner}
                                            </Text>
                                            <Text pt='2' fontSize='sm'>
                                                Amount:  {offer.amount}
                                            </Text>

                                        </Box>)}

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