export type Game = {
  id: string;
  name: string;
  description: string;
  date: string;
  price: number;
  place: string;
  participants: Player[];
};

export type Player = {
  id: string;
  name: string;
  role: string;
};
