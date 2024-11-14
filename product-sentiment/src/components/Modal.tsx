import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, Button, useDisclosure, Image, Box, Text, Flex, VStack, HStack
} from '@chakra-ui/react'
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from "chart.js";
import { Product } from '../App';
import { useEffect, useState } from 'react';
import config from '../config.json';
ChartJS.register(ArcElement, Tooltip, Legend);

// Image sample
// 'https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'

interface Sentiment {
    positive: number;
    negative: number;
    top_words: string[]
}

export function ProductModal({ product }: { product: Product }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [resData, setResData] = useState<Sentiment>();

    useEffect(() => {
        fetch(config.server_url + '/products/' + product.id + '/sentiment')
            .then(res => res.json() as Promise<Sentiment>)
            .then(data => setResData(data))
            .catch(console.error)
    }, [setResData]);


    const data = {
        datasets: [
            {
                data: [resData?.positive, resData?.negative],
                backgroundColor: ["#239463", "#A42636"],
                borderColor: "#1E1E2C",
                hoverOffset: 4,
                borderWidth: [0, 0, 0]
            },
        ],
    };
    return (
        <>
            <div className='w-[80%] lg:w-[100%] relative' >
                <Image
                    objectFit='cover'
                    w={{ base: '100%', sm: '100%', md: '100%' }}
                    src={product.image}
                    alt='Caffe Latte'
                />
                <div className='bg-overlay absolute bottom-0 w-full flex justify-between items-center px-3 py-2'>
                    <div className='text-[14px]'>
                        <p className='font-[500]'>{product.name}</p>
                        <p className='text-[12px]'>{product.last_comment_date.toLocaleString('en', { dateStyle: 'short' })}</p>
                    </div>
                    <button className='bg-secondary px-3 py-1 border-none rounded-sm text-[14px]' onClick={onOpen}>View chart</button>
                </div>
            </div>

            <Modal isOpen={isOpen} size={['sm', '3xl']} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg='#282928' color='#f2f2f3'>
                    <ModalHeader fontWeight='700' fontSize='20px'>{product.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack borderRadius={"18.6348px"} p={"4"}>
                            <Text
                                color={"white"}
                                textAlign={"center"}
                                fontSize={"18px"}
                                fontWeight="600"
                            >
                                Product Sentiment Chart
                            </Text>
                            <HStack gap='30px'>
                                <Doughnut data={data} width="60%" height="60%" />
                                <VStack gap='10px'>
                                    <Flex justifyContent={"center"} alignItems={"center"} mt='2'>
                                        <Box w="10px" h="10px" bgColor="#239463" rounded="50%" mr="7px"></Box>
                                        <Text color={"#f2f2f3"}>Positive</Text>
                                    </Flex>
                                    <Flex justifyContent={"center"} alignItems={"center"} mt='2'>
                                        <Box w="10px" h="10px" bgColor="#A42636" rounded="50%" mr="7px"></Box>
                                        <Text color={"#f2f2f3"}>Negative</Text>
                                    </Flex>
                                </VStack>
                            </HStack>

                            <div>
                                <p className='font-[600] pt-6 text-center px-2 lg:px-5'>Most Common Words :
                                    {resData?.top_words.map((word, index) => <span className='font-[400]' key={index}>{word} </span>)}
                                </p>
                            </div>

                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button bg='#239463' color='#f2f2f3' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}