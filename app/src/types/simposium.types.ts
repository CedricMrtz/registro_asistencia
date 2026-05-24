export interface Event {
  idEvento: number;
  nombreEvento: string;
  fecha_comienzo: Date;
  fecha_acabado: Date;
  idSimposium: number;
  nombreTipo: string;
}

export interface Simposium {
  idSimposium: number;
  nombre: string;
  fecha_comienzo: Date;
  fecha_acabado: Date;
  capacidad_asistentes: number;
  adminID: number;
  Evento: Event[];
}
