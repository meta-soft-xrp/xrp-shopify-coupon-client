import { useEffect } from "react";
import {
	Box,
  Heading,
  Icon,
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
	Skeleton
} from '@chakra-ui/react';
import { DateTime } from "luxon";
import Carousel from "../../components/carousel";
import {
	IoCaretForwardOutline,
	IoStopCircleOutline,
	IoEye,
	IoCartSharp,
	IoLogoUsd
} from 'react-icons/io5';
import { Link } from "react-router-dom"
import useLooksStore from "../../store/looks"

const renderSkeleton = (looks) => {
	return (
		<Flex alignItems="flex-start" flexDirection="row">
			<Skeleton> 
				<Carousel medias={[]} />
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

const renderLookPoints = ({ look }) => {
	return (
		<SimpleGrid columns={1} spacing={5} marginTop="5">
			<HStack align={'top'}>
				<Box color={'green.400'} px={2}>
					<Icon as={IoEye} />
				</Box>
				<VStack align={'start'}>
					<Text fontWeight={600}>12,200 views</Text>
					<Text color={'gray.600'} marginTop="0" style={{ marginTop: 0 }}>Total number of views</Text>
				</VStack>
			</HStack>
			<HStack align={'top'}>
				<Box color={'green.400'} px={2}>
					<Icon as={IoCartSharp} />
				</Box>
				<VStack align={'start'}>
					<Text fontWeight={600}>$3000 add to cart</Text>
					<Text color={'gray.600'} marginTop="0" style={{ marginTop: 0 }}>Total cart adds from looks</Text>
				</VStack>
			</HStack>
			<HStack align={'top'}>
				<Box color={'green.400'} px={2}>
					<Icon as={IoLogoUsd} />
				</Box>
				<VStack align={'start'}>
					<Text fontWeight={600}>10% conversion</Text>
					<Text color={'gray.600'} marginTop="0" style={{ marginTop: 0 }}>Revenue of conversion</Text>
				</VStack>
			</HStack>
	</SimpleGrid>
	)
}

const renderCarousel = ({ orangeColorMode, look }) => {
	return (
		<Box
			display="flex"
			flex="1"
			marginRight="3"
			position="relative"
			alignItems="center">
			<Box
				width={{ base: '100%' }}
				zIndex="2"
			>
				<Carousel medias={look?.get('medias')} />
			</Box>
			<Box zIndex="1" width="100%" position="absolute" height="100%">
				<Box
					bgGradient={orangeColorMode}
					backgroundSize="20px 20px"
					opacity="0.4"
					height="100%"
				/>
			</Box>
		</Box>

	)
}

export const LooksCreatedDate = (props) => {
	const date = DateTime.fromISO(props.date.toISOString())
  return (
    <HStack display="flex" alignItems="center">
      <Text fontWeight="light" fontSize="sm">Created at:</Text>
      <Text fontSize="sm">{date.toLocaleString(DateTime.DATETIME_MED)}</Text>
    </HStack>
  );
};

export const renderLooks = ({ looks, orangeColorMode, getLooks }) => {
	if (looks.get.loading) {
		return renderSkeleton(looks);
	} else if (looks.get.failure.error) {
		return (
			<Box>
				<Flex direction="column" align="center">
					<VStack spacing="3">
						<Heading as="h1" size="md">{looks.get.failure.message}</Heading>
					</VStack>
					<br />
					<Divider />
					<br />
					<VStack spacing="3">
						<Button onClick={() => getLooks()}>Try Again</Button>	
					</VStack>
				</Flex>
			</Box>
		);
	} else if (looks.get.success.data.length) {
		return looks.get.success.data.map(look => (
			<Box>
				<Box
					marginTop={{ base: '1', sm: '5' }}
					marginBottom={{ base: '1', sm: '5' }}
					display="flex"
					flexDirection={{ base: 'column', sm: 'row' }}
					justifyContent="space-between"
					key={look.objectId}
				>
					{renderCarousel({ orangeColorMode, look })}
					<Box
						display="flex"
						flex="1"
						flexDirection="column"
						justifyContent="flex-start"
						marginTop={{ base: '3', sm: '0' }}>
						{/* <BlogTags tags={['Engineering', 'Product']} /> */}
						<Skeleton isLoaded={!looks.get.loading}>
						<Heading marginTop="1">
							<Link textDecoration="none" _hover={{ textDecoration: 'none' }} to={`looks/${look.id}`}>
								{look.get('name')}
							</Link>
						</Heading>
						<LooksCreatedDate date={look.get('createdAt')} />
						</Skeleton>
						{renderLookPoints({ look })}
						<Stack direction='row' spacing={4} marginTop="5">
							<Link to={`looks/${look.id}`}>
								<Button leftIcon={<IoCaretForwardOutline />} variant='solid'>
									View
								</Button>
							</Link>
						</Stack>
					</Box>
				</Box>
				<Divider marginTop="1em" marginBottom="1em"/>
			</Box>
		))
	}
	return null;
}
  
function Looks(props) {
    const looks = useLooksStore((state) => state.looks);
    const getLooks = useLooksStore((state) => state.getLooks);
    const toast = useToast();
		const orangeColorMode = useColorModeValue(
			'radial(orange.600 1px, transparent 1px)',
			'radial(orange.300 1px, transparent 1px)'
		);
		useEffect(() => {
			getLooks();
		}, [])
    
    return (
			<Container maxW={'7xl'} p="12">
				{renderLooks({ looks, orangeColorMode, getLooks })}
    </Container>
  );
};

  
  Looks.defaultProps = {
  }

  export default Looks;