import { Heading, Center, Link, VStack } from "@chakra-ui/react";
import useDocumentTitle from "../Hooks/useDocumentTitle";

function App() {
  useDocumentTitle("Seastove Games");

  return (
    <Center bgColor={"brand.100"} w="100vw" h="100vh">
      <VStack>
        <Heading>Hi, here's some games:</Heading>
        <Link
          bgColor="brand.300"
          color="gray.700"
          p={{ base: "2rem", md: "4rem" }}
          borderRadius={"8px"}
          fontSize={{ base: "2rem", md: "4rem" }}
          href="/#/daily-history"
        >
          Daily History Game
        </Link>
      </VStack>
    </Center>
  );
}

export default App;
