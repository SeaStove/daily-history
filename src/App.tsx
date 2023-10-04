import {
  Center,
  Box,
  Button,
  HStack,
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
  Flex,
  AbsoluteCenter,
  Input,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ExternalLinkIcon,
  InfoOutlineIcon,
  RepeatIcon,
} from "@chakra-ui/icons";

import { useEffect, useRef, useState, useCallback } from "react";
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
      width="100%"
      {...rest}
    >
      {event}
    </Box>
  );
}

function App() {
  const MIN_YEAR = 1;
  const MAX_YEAR = 2023;
  // const BASEYEAR = Math.floor((MAXYEAR + MINYEAR) / 2);
  const BASE_YEAR = 2023;
  const BASE_CORRECT_DIGITS = [false, false, false, false];
  // const BASEYEAR = "";
  const [yearToGuess, setYearToGuess] = useState<string | null>();
  const [year, setYear] = useState<string>(BASE_YEAR.toString());
  const [events, setEvents] = useState<Event[]>([]);
  const [misses, setMisses] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [correctDigits, setCorrectDigits] = useState(BASE_CORRECT_DIGITS);
  const [won, setWon] = useState(false);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const toast = useToast();

  function onSubmit() {
    if (year) {
      if (year === yearToGuess) {
        setWon(true);
        setGameOver(true);
      } else {
        if (misses.length >= 4) {
          setGameOver(true);
        } else {
          checkDigits();
          setMisses((misses) => {
            return [...misses, parseInt(year)];
          });
        }
      }
    }
  }

  function newGame() {
    setMisses([]);
    setWon(false);
    setGameOver(false);
    setEvents([]);
    getRandomYear();
    setYear(BASE_YEAR.toString());
    setCorrectDigits([]);
    onClose();
  }

  async function getRandomYear() {
    const randomYear =
      Math.floor(Math.random() * (MAX_YEAR - MIN_YEAR + 1)) + MIN_YEAR;

    console.log(randomYear);

    const response = await axios.get(
      `https://api.api-ninjas.com/v1/historicalevents?year=${randomYear}`,
      {
        headers: { "X-Api-Key": import.meta.env.VITE_API_KEY },
      }
    );

    if (response?.data) {
      if (response.data.length > 5) {
        setYearToGuess(randomYear.toString());
        setEvents(response.data);
      } else {
        getRandomYear();
      }
    } else {
      console.error("Couldn't retrieve data from API.");
    }
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

  function paddedDigits(num: string) {
    console.log(num);
    let formattedYear = num;
    const targetLength = 4;
    if (formattedYear.length < targetLength) {
      const padding = new Array(targetLength - formattedYear.length + 1).join(
        "0"
      );
      formattedYear = padding + formattedYear;
    }
    return formattedYear.split("").map(Number);
  }

  const yearType: { [key: number]: string } = {
    0: "Millenium",
    1: "Century",
    2: "Decade",
    3: "Digit",
  };

  const checkDigits = useCallback(() => {
    if (year && yearToGuess) {
      console.log(year, yearToGuess);
      const guessDigits = paddedDigits(year);
      const answerDigits = paddedDigits(yearToGuess);
      let newCorrectDigits = [...correctDigits];

      for (let index = 0; index < 4; index++) {
        if (guessDigits[index] === answerDigits[index]) {
          if (newCorrectDigits[index] === false) {
            newCorrectDigits[index] = true;
            toast.closeAll();
            toast({
              title: `${yearType[index]} is correct!`,
              status: "success",
              duration: 1000,
              isClosable: true,
            });
          }
        } else {
          break;
        }
      }
      setCorrectDigits(newCorrectDigits);
    }
  }, [year, yearToGuess]);

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
                isExternal
                textAlign={"center"}
              >
                To learn more, check out the wikipedia page for {yearToGuess}{" "}
                A.D. <ExternalLinkIcon mx="2px" />
              </Link>
            </VStack>
          </ModalBody>

          <ModalFooter w="100%">
            <Center w="100%">
              <Button
                aria-label="New Game"
                size="lg"
                bg="brand.400"
                color="white"
                ml="1rem"
                rightIcon={<RepeatIcon />}
                onClick={newGame}
                type="submit"
              >
                New Game
              </Button>
            </Center>
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
          {events.length > 0 ? (
            <VStack w="500px" my="5rem">
              {events.slice(0, misses.length + 1).map((event: Event, index) => (
                <EventBox event={event.event} key={index} />
              ))}
              <Heading
                color="white"
                py="2rem"
                position={"sticky"}
                bg="brand.100"
                textAlign={"center"}
              >
                Which year did these events happen? {misses.length + 1} / 5
              </Heading>
              <Text fontSize="2xl">
                {[...Array(4)].map((_, index) => {
                  return correctDigits[index] && yearToGuess
                    ? yearToGuess[index]
                    : "X";
                })}
              </Text>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  gameOver ? onOpen() : onSubmit();
                }}
              >
                {gameOver ? (
                  <Flex>
                    <Button
                      aria-label="New Game"
                      size="lg"
                      bg="brand.400"
                      color="white"
                      ml="1rem"
                      rightIcon={<RepeatIcon />}
                      onClick={newGame}
                    >
                      New Game
                    </Button>
                    <Button
                      aria-label="View Details"
                      size="lg"
                      bg="brand.400"
                      color="white"
                      ml="1rem"
                      rightIcon={<InfoOutlineIcon />}
                      type="submit"
                    >
                      View Details
                    </Button>
                  </Flex>
                ) : (
                  <Flex>
                    {InputYearPicker()}
                    <Button
                      size="lg"
                      bg="brand.400"
                      color="white"
                      ml="1rem"
                      disabled={events.length === 0 || !year}
                      type="submit"
                    >
                      Guess
                    </Button>
                  </Flex>
                )}
              </form>
            </VStack>
          ) : (
            <AbsoluteCenter>
              <Spinner color="brand.300" />
            </AbsoluteCenter>
          )}
        </Center>
      </Box>
    </>
  );

  function InputYearPicker() {
    return (
      <HStack>
        <IconButton
          aria-label="Decrease Year"
          onClick={() => {
            setYear((year) => {
              const updatedYear = parseInt(year) - 1;
              return updatedYear.toString();
            });
          }}
          icon={<ArrowDownIcon />}
          isDisabled={parseInt(year) <= MIN_YEAR}
        />
        <Input
          size="lg"
          maxLength={4}
          isRequired
          value={year}
          type="number"
          min={MIN_YEAR}
          max={MAX_YEAR}
          htmlSize={4}
          onChange={(event) => {
            if (event.target.value.length <= 4) setYear(event.target.value);
          }}
          pattern="[0-9]*"
          inputMode="numeric"
          textAlign={"center"}
        />
        <IconButton
          aria-label="Increase Year"
          icon={<ArrowUpIcon />}
          onClick={() => {
            setYear((year) => {
              const updatedYear = parseInt(year) + 1;
              return updatedYear.toString();
            });
          }}
          isDisabled={parseInt(year) >= MAX_YEAR}
        />
      </HStack>
    );
  }
}

export default App;
