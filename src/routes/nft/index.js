import React from 'react';
import NavBar from "../../components/navbar";
import useNFTStore from "../../store/nft";
import { Box, Button, Container, Heading, Input, Stack, StackDivider, Text, useToast } from '@chakra-ui/react';



const NFTRoute = () => {

    const nftState = useNFTStore((state) => state.nftState);
    const postNFTState = useNFTStore((state) => state.postNFTState);
    const toast = useToast();

    const handleCreateNFT = (event) => {
        event.preventDefault();
        const form = event.target;
        const seed = form.seed.value;
        const uri = form.uri.value;
        const transferFee = form.transferFee.value;
        const flags = form.flags.value;

        postNFTState(seed, uri, transferFee, flags);
        if (!nftState.post.loading) {
            console.log(nftState.post, "NFT STate POST Loading");
            form.reset();
        }

    }

    if (nftState.post.success.ok) {
        toast({
            title: "NFT create success",
            status: "success",
        });
    }


    return (
        <>
            <NavBar></NavBar>
            <Container maxW={"7xl"} p={[12, 6]} bg="#f6f6f7" textAlign={"left"}>

                <Box as="section" maxW="5xl" mx="auto">
                    <Text fontSize={"24px"} fontWeight={"semibold"}>Create <Text as="span" color='blue.600' fontWeight={"bold"}>NFTs</Text> to gift your customers</Text>
                </Box>
                <Box bg="white" maxW="5xl" mx="auto" borderRadius={10} p={5} mt={'24px'} boxShadow="md">
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
                            Create NFT
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
            </Container>
        </>
    );
};

export default NFTRoute;