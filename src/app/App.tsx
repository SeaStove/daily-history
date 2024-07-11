import { Center, Link, VStack, Text, Flex, Box } from "@chakra-ui/react";
import useDocumentTitle from "../common/hooks/useDocumentTitle";

function App() {
  useDocumentTitle("Seastove Games");

  return (
    <Center bgColor={"brand.100"} w="100vw" h="100vh">
      <VStack gap="5rem">
        <Link
          bgColor="#1D2B53"
          color="#F9F7C9"
          p={{ base: "2rem", md: "4rem" }}
          borderRadius={"8px"}
          fontSize={{ base: "2rem", md: "4rem" }}
          href="http://www.eruptle.app/"
          fontFamily="HONK"
        >
          <Flex alignItems={"center"}>
            {/* <Image src="eruption.png" alt="Volcano" w="64px" h="64px" />   */}
            Eruptle
            {/* <Image src="eruption.png" alt="Volcano" w="64px" h="64px" /> */}
          </Flex>
        </Link>
        <Link
          bgColor="brand.300"
          color="gray.700"
          p={{ base: "2rem", md: "4rem" }}
          borderRadius={"8px"}
          fontSize={{ base: "2rem", md: "4rem" }}
          href="/#/endless-history"
        >
          Endless History Game
        </Link>
        <Box as="footer" textAlign="center" color="white">
          <Text mb={2}>
            <Link
              href="https://github.com/seastove"
              target="_blank"
              rel="noopener noreferrer"
              textDecoration={"underline"}
            >
              github.com/seastove
            </Link>{" "}
            |{" "}
            <Link
              href="https://seastove.games"
              target="_blank"
              rel="noopener noreferrer"
              textDecoration={"underline"}
            >
              seastove.games
            </Link>
          </Text>
          <Text>
            &copy; {new Date().getFullYear()} Christian Stovall. All rights
            reserved.
          </Text>
        </Box>
      </VStack>
    </Center>
  );
}

export default App;
