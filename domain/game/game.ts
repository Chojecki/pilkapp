export type Game = {
  id: string;
  name: string;
  description: string;
  date: string;
  price: number;
  place: string;
  players?: Player[];
  creator?: string;
  numberOfPlayers?: number;
  time?: string;
  creatorContact?: string;
  customTeams: boolean;
  canAnonRemove?: boolean;
  creatorEmail?: string;
  isPublic?: boolean;
  city?: string;
};

export type Player = {
  id: string;
  name: string;
  role: string;
  didPay?: boolean;
  createdAt?: number;
  gameId: string;
  userId?: string;
  order?: number;
  team?: 1 | 2;
  confirmed?: boolean;
  skill?: string;
  shape?: string;
};
