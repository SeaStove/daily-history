import {
  AbsoluteCenter,
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
} from "@chakra-ui/react";
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
  const [yearToGuess, setYearToGuess] = useState<number | null>();
  const [year, setYear] = useState(1800);
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
      setMisses((misses) => {
        return [...misses, year];
      });
    }
  }

  function newGame() {
    setMisses([]);
    setWon(false);
    setGameOver(false);
    setEvents([]);
    getRandomYear();
    setYear(1800);
  }

  function getRandomYear() {
    const min = 1600;
    const max = 2023;
    const randomYear = Math.floor(Math.random() * (max - min + 1)) + min;
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
    if (misses.length >= 5) {
      setGameOver(true);
    }
  }, [misses]);

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
        h="100%"
        w="100vw"
        bg="brand.100"
        overflowX="hidden"
      >
        <AbsoluteCenter>
          <VStack w="500px" my="5rem">
            <Heading color="white" pb="2rem">
              Which year was this?
            </Heading>
            {events.length > 0 ? (
              events
                .slice(0, misses.length + 1)
                .map((event: Event, index) => (
                  <EventBox event={event.event} key={index} />
                ))
            ) : (
              <Spinner color="brand.300" />
            )}

            <Slider
              aria-label="slider-ex-1"
              onChange={(val) => setYear(val)}
              value={year}
              min={1600}
              max={2023}
              mb="5rem"
              mt="4rem"
            >
              <SliderMark
                value={1600}
                mt="1"
                ml="-2.5"
                fontSize="lg"
                color="white"
              >
                1600
              </SliderMark>
              <SliderMark
                value={2023}
                mt="1"
                ml="-2.5"
                fontSize="lg"
                color="white"
              >
                2023
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
              <SliderThumb bg="brand.100" />
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
        </AbsoluteCenter>
      </Box>
    </>
  );
}

export default App;
