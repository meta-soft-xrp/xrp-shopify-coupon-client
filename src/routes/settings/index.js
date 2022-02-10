import { useEffect, useContext } from "react";
import {
	Box,
  Heading,
  ButtonGroup,
  Text,
  Divider,
  HStack,
  Flex,
  SimpleGrid,
  Stack,
  Button,
  useColorModeValue,
  Container,
  VStack,
	useToast,
	Skeleton,
	Alert,
} from '@chakra-ui/react';
import useScriptsStore from "../../store/scripts";
import { ShopContext } from "../../context";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";
import NavBar from "../../components/navbar";


const SettingsRoute = () => {
	const shop = useContext(ShopContext);
	const scripts = useScriptsStore((state) => state.scripts);
  const postScripts = useScriptsStore((state) => state.postScripts);
	const destroyScripts = useScriptsStore((state) => state.destroyScripts);
	const toast = useToast();

	const enableWidget = async () => {
		try {
			await postScripts(shop);
			toast({
				title: `Widget added successfully!`,
				status: 'success'
			});
		} catch (e) {
			toast({
				title: e.message || INTERNAL_SERVER_ERROR,
				status: 'error'
			})
		}
	}

	const disableWidget = async () => {
		try {
			await destroyScripts(shop);
			toast({
				title: `Widget removed successfully!`,
				status: 'success'
			});
		} catch (e) {
			toast({
				title: e.message || INTERNAL_SERVER_ERROR,
				status: 'error'
			})
		}
	}

	
	return  (
		<>
		<NavBar />
		<Container maxW={'7xl'} p="12">
			<Box as="section">
				<Box
					maxW="2xl"
					mx="auto"
					px={{ base: '6', lg: '8' }}
					py={{ base: '16', sm: '20' }}
					textAlign="center"
				>
					<Heading size="3xl" fontWeight="extrabold" letterSpacing="tight">
						Widget embed settings
					</Heading>
					<Text mt="4" fontSize="lg">
						Enable or disable "Shop the look" widget on your store. The widget gets appended to the bottom of your store page above the
						footer.
					</Text>
					<ButtonGroup mt="8" variant='outline' spacing='6'>
						<Button isLoading={scripts.post.loading} fontWeight="bold" size="lg" colorScheme='blue' onClick={enableWidget}>Enable Widget Embed</Button>
						<Button isLoading={scripts.destroy.loading} fontWeight="bold" size="lg" colorScheme="red" onClick={disableWidget}>Disable Widget Embed</Button>
					</ButtonGroup>
				</Box>
			</Box>
		</Container>
		</>
	)

}

export default SettingsRoute;