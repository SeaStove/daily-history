import {
  Center,
  Slider,
  SliderTrack,
  SliderMark,
  SliderThumb,
  Tooltip,
  Box,
  Button,
  Heading,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Spinner,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
interface Event {
  year: string;
  month: string;
  day: string;
  event: string;
}

function EventBox({ event, ...rest }: { event: string }) {
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      bg="brand.300"
      color="gray.600"
      fontWeight={600}
      w={"500px"}
      {...rest}
    >
      {event}
    </Box>
  );
}

function App() {
  const MINYEAR = 1;
  const MAXYEAR = 2023;
  const BASEYEAR = Math.floor((MAXYEAR + MINYEAR) / 2);
  const [yearToGuess, setYearToGuess] = useState<number | null>();
  const [year, setYear] = useState(BASEYEAR);
  const [events, setEvents] = useState<Event[]>([]);
  const [misses, setMisses] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const { onOpen, onClose, isOpen } = useDisclosure();

  function onSubmit() {
    if (year === yearToGuess) {
      setWon(true);
      setGameOver(true);
    } else {
      if (misses.length >= 4) {
        setGameOver(true);
      } else {
        setMisses((misses) => {
          return [...misses, year];
        });
      }
    }
  }

  function newGame() {
    setMisses([]);
    setWon(false);
    setGameOver(false);
    setEvents([]);
    getRandomYear();
    setYear(BASEYEAR);
  }

  function getRandomYear() {
    const randomYear =
      Math.floor(Math.random() * (MAXYEAR - MINYEAR + 1)) + MINYEAR;
    setYearToGuess(randomYear);
  }

  useEffect(() => {
    if (gameOver) {
      onOpen();
    }
  }, [gameOver]);

  const gotYearRef = useRef(false);
  useEffect(() => {
    if (gotYearRef.current === false) {
      getRandomYear();
      gotYearRef.current = true;
    }
  }, []);

  useEffect(() => {
    async function getEvents() {
      const response = await axios.get(
        `https://api.api-ninjas.com/v1/historicalevents?year=${yearToGuess}`,
        {
          headers: { "X-Api-Key": import.meta.env.VITE_API_KEY },
        }
      );

      if (response?.data) {
        if (response.data.length > 5) {
          setEvents(response.data);
        } else {
          getRandomYear();
        }
      } else {
        console.error("Couldn't retrieve data from API.");
      }
    }
    if (yearToGuess) {
      getEvents();
    }
  }, [yearToGuess]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="brand.100" zIndex={3}>
          <ModalHeader color="white">
            {won ? "You Won!" : "You Lost!"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Heading color="white">The year was {yearToGuess}</Heading>
              <Text fontSize={"xl"} color="white">
                Some other events from that year...
              </Text>
              {events
                .slice(misses.length + 1, events.length)
                .map((event, index) => (
                  <EventBox event={event.event} key={index} />
                ))}
              <Link
                href={`https://en.wikipedia.org/wiki/AD_${yearToGuess}`}
                textDecoration={"underline"}
                color="gray.100"
                isExternal
                textAlign={"center"}
              >
                To learn more, check out the wikipedia page for {yearToGuess}{" "}
                A.D. <ExternalLinkIcon mx="2px" />
              </Link>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button bg="brand.400" color="white" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box
        position="relative"
        minH="100vh"
        maxH="100vh"
        h="100%"
        w="100vw"
        bg="brand.100"
        overflowX="hidden"
        p="2rem"
      >
        <Center>
          <VStack w="500px" my="5rem">
            {events.length > 0 ? (
              events
                .slice(0, misses.length + 1)
                .map((event: Event, index) => (
                  <EventBox event={event.event} key={index} />
                ))
            ) : (
              <Spinner color="brand.300" />
            )}
            <Heading
              color="white"
              py="2rem"
              position={"sticky"}
              bg="brand.100"
              textAlign={"center"}
            >
              Which year did these events happen? {misses.length + 1} / 5
            </Heading>
            <Slider
              aria-label="slider-ex-1"
              onChange={(val) => setYear(val)}
              value={year}
              min={MINYEAR}
              max={MAXYEAR}
              mb="5rem"
              mt="4rem"
            >
              <SliderMark
                value={MINYEAR}
                mt="1"
                ml="-2.5"
                fontSize="lg"
                color="white"
              >
                {MINYEAR}
              </SliderMark>
              <SliderMark
                value={MAXYEAR}
                mt="1"
                ml="-2.5"
                fontSize="lg"
                color="white"
              >
                {MAXYEAR}
              </SliderMark>

              <Tooltip
                // hasArrow
                bg="brand.100"
                color="white"
                placement="top"
                isOpen
                fontSize="2rem"
                label={`${year}`}
              >
                <SliderThumb />
              </Tooltip>
              <SliderTrack bg="brand.400" />
              <SliderThumb bg="brand.200" />
            </Slider>
            {gameOver ? (
              <Button size="lg" bg="brand.400" color="white" onClick={newGame}>
                New Game
              </Button>
            ) : (
              <Button
                size="lg"
                bg="brand.400"
                color="white"
                onClick={onSubmit}
                disabled={events.length === 0}
              >
                Submit
              </Button>
            )}
          </VStack>
        </Center>
      </Box>
    </>
  );
}

export default App;
