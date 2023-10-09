import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// const [yearToGuess, setYearToGuess] = useState<string | null>();
//   const [year, setYear] = useState<string>(BASE_YEAR.toString());
//   const [events, setEvents] = useState<Event[]>([]);
//   const [misses, setMisses] = useState<string[]>([]);
//   const [gameOver, setGameOver] = useState(false);
//   const [correctDigits, setCorrectDigits] = useState(BASE_CORRECT_DIGITS);
//   const [won, setWon] = useState(false);

export const MIN_YEAR = 1;
export const MAX_YEAR = 2023;
export const BASE_YEAR = 2023;
export const BASE_CORRECT_DIGITS = [false, false, false, false];

export const yearType: { [key: number]: string } = {
  0: "Millenium",
  1: "Century",
  2: "Decade",
  3: "Digit",
};

export interface Event {
  year: string;
  month: string;
  day: string;
  event: string;
}

export interface HistoryState {
  yearToGuess: string | null;
  year: string;
  events: Event[];
  misses: string[];
  gameOver: boolean;
  correctDigits: boolean[];
  won: boolean;
}

const initialState: HistoryState = {
  yearToGuess: null,
  year: BASE_YEAR.toString(),
  events: [],
  misses: [],
  gameOver: false,
  correctDigits: BASE_CORRECT_DIGITS,
  won: false,
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    setYearToGuess: (state, action: PayloadAction<string | null>) => {
      state.yearToGuess = action.payload;
    },
    setYear: (state, action: PayloadAction<string>) => {
      state.year = action.payload;
    },
    increaseYear: (state) => {
      state.year = (parseInt(state.year) + 1).toString();
    },
    decreaseYear: (state) => {
      state.year = (parseInt(state.year) - 1).toString();
    },
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    addMiss: (state, action: PayloadAction<string>) => {
      state.misses = [...state.misses, action.payload];
    },
    resetState: () => initialState,
    setGameOver: (state, action: PayloadAction<boolean>) => {
      state.gameOver = action.payload;
    },
    setCorrectDigits: (state, action: PayloadAction<boolean[]>) => {
      state.correctDigits = action.payload;
    },
    setWon: (state) => {
      state.won = true;
    },
  },
});

export const {
  setYearToGuess,
  setYear,
  increaseYear,
  decreaseYear,
  setEvents,
  resetState,
  addMiss,
  setGameOver,
  setCorrectDigits,
  setWon,
} = historySlice.actions;

export const selectYearToGuess = (state: { history: HistoryState }) =>
  state.history.yearToGuess;
export const selectYear = (state: { history: HistoryState }) =>
  state.history.year;
export const selectEvents = (state: { history: HistoryState }) =>
  state.history.events;
export const selectMisses = (state: { history: HistoryState }) =>
  state.history.misses;
export const selectGameOver = (state: { history: HistoryState }) =>
  state.history.gameOver;
export const selectCorrectDigits = (state: { history: HistoryState }) =>
  state.history.correctDigits;
export const selectWon = (state: { history: HistoryState }) =>
  state.history.won;

export default historySlice.reducer;
