export interface Event {
  id: number;
  name: string;
  simposiumId: number;
}

export interface Simposium {
  id: number;
  name: string;
  events: Event[];
}
