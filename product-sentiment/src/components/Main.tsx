import { Nav } from './Nav'
import { Footer } from './Footer'
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
import {
    Box, Text, Flex, VStack, HStack, Button
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export const Main = ({ stats }: { stats: number[] }) => {


    const data = {
        datasets: [
            {
                data: stats,
                backgroundColor: ["#239463", "#A42636", "#1E1E2C"],
                borderColor: "#1E1E2C",
                hoverOffset: 4,
                borderWidth: [0, 0, 0]
            },
        ],
    };


    return (
      <div className="bg-primary text-offWhite lg:min-h-screen flex flex-col justify-between lg:h-[100vh] py-10 lg:py-0">
        <div>
          <div className="hidden lg:block">
            <Nav />
          </div>
          <Link to='/'>
              <Button m="7" bgColor="#239463" color='white'>
                Back
              </Button>
          </Link>
        </div>
        <VStack borderRadius={"18.6348px"} p={"4"} w="100%">
          <HStack gap="30px" flexDirection={["column", "row"]}>
            <Doughnut data={data} width="100%" height="100%" />
            <VStack gap="10px">
              <Flex justifyContent={"center"} alignItems={"center"} mt="2">
                <Box
                  w="10px"
                  h="10px"
                  bgColor="#239463"
                  rounded="50%"
                  mr="7px"
                ></Box>
                <Text color={"#f2f2f3"}>Positive</Text>
              </Flex>

              <Flex justifyContent={"center"} alignItems={"center"} mt="2">
                <Box
                  w="10px"
                  h="10px"
                  bgColor="#A42636"
                  rounded="50%"
                  mr="7px"
                ></Box>
                <Text color={"#f2f2f3"}>Negative</Text>
              </Flex>
            </VStack>
          </HStack>
        </VStack>
        <div className="hidden lg:flex">
          <Footer />
        </div>
      </div>
    );
}