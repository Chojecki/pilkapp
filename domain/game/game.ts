export type Game = {
  id: string;
  name: string;
  description: string;
  date: string;
  price: number;
  place: string;
  participants: Player[];
  creator?: string;
  removedPlayers?: Player[];
  numberOfPlayers?: number;
  time?: string;
};

export type Player = {
  id: string;
  name: string;
  role: string;
};
