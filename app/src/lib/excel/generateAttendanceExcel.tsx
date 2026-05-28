import * as XLSX from "xlsx-js-style"
import { saveAs } from "file-saver"

export interface Alumno {
  matricula: string
  nombre: string
  telefono: string | null
  semestre: number
  email: string
  nombre_carrera: string
}

export interface AlumnoConEscuela extends Alumno {
  siglas_carrera: string
  nombre_escuela: string
  ciudad: string
}

export interface Evento {
  idEvento: number
  nombreEvento: string
  fecha_comienzo: string
  fecha_acabado: string
  idSimposium: number
  nombreTipo: string
}

export interface AlumnoAsistioEvento {
  idAsistencia: number
  matricula: string
  idEvento: number
  fecha_llegada: string
  fecha_salida: string | null
  staffID: number | null
}


interface BorderSide {
  style: string
  color: { rgb: string }
}

interface CellBorder {
  top: BorderSide
  bottom: BorderSide
  left: BorderSide
  right: BorderSide
}

interface CellStyle {
  font: { name: string; sz: number; bold?: boolean }
  fill: { fgColor: { rgb: string } }
  alignment: { horizontal: string; vertical: string; wrapText: boolean }
  border: CellBorder
}


function autoFitColumns(data: (string | number | null | undefined)[][]): { wch: number }[] {
  const colWidths: number[] = []

  data.forEach(row => {
    row.forEach((cell, i) => {
      const cellLength = cell != null ? cell.toString().length : 0
      colWidths[i] = Math.max(colWidths[i] ?? 10, cellLength)
    })
  })

  return colWidths.map(w => ({ wch: w + 2 }))
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? "" : d.toLocaleTimeString()
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString()
}


const borderStyle: CellBorder = {
  top: { style: "thin", color: { rgb: "000000" } },
  bottom: { style: "thin", color: { rgb: "000000" } },
  left: { style: "thin", color: { rgb: "000000" } },
  right: { style: "thin", color: { rgb: "000000" } },
}

const groupStyle: CellStyle = {
  font: { name: "DM Sans", sz: 10, bold: true },
  fill: { fgColor: { rgb: "d89d9b" } },
  alignment: { horizontal: "center", vertical: "center", wrapText: true },
  border: borderStyle,
}

const headerStyle: CellStyle = {
  font: { name: "DM Sans", sz: 10, bold: true },
  fill: { fgColor: { rgb: "f4cccc" } },
  alignment: { horizontal: "center", vertical: "center", wrapText: true },
  border: borderStyle,
}

const baseStyle: Omit<CellStyle, "fill"> & { fill?: CellStyle["fill"] } = {
  font: { name: "DM Sans", sz: 10 },
  alignment: { horizontal: "center", vertical: "center", wrapText: true },
  border: borderStyle,
}

function applyStyles(ws: XLSX.WorkSheet): void {
  const range = XLSX.utils.decode_range(ws["!ref"] ?? "A1")

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const addr = XLSX.utils.encode_cell({ r: R, c: C })
      if (!ws[addr]) ws[addr] = { t: "s", v: "" }
      ws[addr].s = baseStyle
    }
  }

  for (let C = range.s.c; C <= range.e.c; ++C) {
    const groupCell = XLSX.utils.encode_cell({ r: 0, c: C })
    const headerCell = XLSX.utils.encode_cell({ r: 1, c: C })
    if (ws[groupCell]) ws[groupCell].s = groupStyle
    if (ws[headerCell]) ws[headerCell].s = headerStyle
  }

  ws["!rows"] = [{ hpt: 20 }, { hpt: 20 }]
}

export function generateExcel(
  alumnos: AlumnoConEscuela[],
  asistencia: AlumnoAsistioEvento[],
  eventos: Evento[]
): void {

  const generalHeaders = [
    "MATRICULA",
    "NOMBRE",
    "EMAIL",
    "TELÉFONO",
    "SEMESTRE",
    "CARRERA",
    "ESCUELA",
    "CIUDAD",
  ] as const

  const asistenciaHeaders = ["EVENTO", "ENTRADA", "SALIDA"] as const

  // HOJA 1 — Asistencia detallada (una fila por registro de AlumnoAsistioEvento)

  type Sheet1Row = (string | number | null)[]
  const sheet1Rows: Sheet1Row[] = []

  for (const alumno of alumnos) {
    const registros = asistencia.filter(a => a.matricula === alumno.matricula)

    if (registros.length === 0) {
      sheet1Rows.push([
        alumno.matricula,
        alumno.nombre,
        alumno.email,
        alumno.telefono ?? "",
        alumno.semestre,
        alumno.nombre_carrera,
        alumno.nombre_escuela,
        alumno.ciudad,
        "", // EVENTO
        "", // ENTRADA
        "", // SALIDA
      ])
      continue
    }

    for (const registro of registros) {
      const evento = eventos.find(e => e.idEvento === registro.idEvento)

      sheet1Rows.push([
        alumno.matricula,
        alumno.nombre,
        alumno.email,
        alumno.telefono ?? "",
        alumno.semestre,
        alumno.nombre_carrera,
        alumno.nombre_escuela,
        alumno.ciudad,
        evento?.nombreEvento ?? `Evento #${registro.idEvento}`,
        formatTime(registro.fecha_llegada),
        formatTime(registro.fecha_salida),
      ])
    }
  }

  const headerRow1Sheet1 = [
    "Datos del Alumno", "", "", "", "", "", "", "",
    "Asistencia", "", "",
  ]
  const headerRow2Sheet1 = [...generalHeaders, ...asistenciaHeaders]

  const ws1 = XLSX.utils.aoa_to_sheet([
    headerRow1Sheet1,
    headerRow2Sheet1,
    ...sheet1Rows,
  ])

  ws1["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
    { s: { r: 0, c: 8 }, e: { r: 0, c: 10 } },
  ]

  const data1 = [headerRow1Sheet1, headerRow2Sheet1, ...sheet1Rows]
  ws1["!cols"] = autoFitColumns(data1)
  applyStyles(ws1)

  // HOJA 2 — Cumplimiento (% de tiempo por evento por alumno)

  const sortedEventos = [...eventos].sort(
    (a, b) => new Date(a.fecha_comienzo).getTime() - new Date(b.fecha_comienzo).getTime()
  )

  const eventosPorFecha: Record<string, Evento[]> = {}
  for (const ev of sortedEventos) {
    const fecha = formatDate(ev.fecha_comienzo)
    if (!eventosPorFecha[fecha]) eventosPorFecha[fecha] = []
    eventosPorFecha[fecha].push(ev)
  }

  const header1Sheet2: string[] = [
    "Datos del Alumno", "", "", "", "", "", "", "",
  ]
  const header2Sheet2: string[] = [...generalHeaders]

  for (const [fecha, evs] of Object.entries(eventosPorFecha)) {
    for (let i = 0; i < evs.length; i++) header1Sheet2.push(fecha)
    header2Sheet2.push(...evs.map(e => e.nombreEvento))
  }

  type Sheet2Row = (string | number)[]
  const sheet2Rows: Sheet2Row[] = []

  for (const alumno of alumnos) {
    const row: Sheet2Row = [
      alumno.matricula,
      alumno.nombre,
      alumno.email,
      alumno.telefono ?? "",
      alumno.semestre,
      alumno.nombre_carrera,
      alumno.nombre_escuela,
      alumno.ciudad,
    ]

    for (const evento of sortedEventos) {
      const eventStart = new Date(evento.fecha_comienzo).getTime()
      const eventEnd = new Date(evento.fecha_acabado).getTime()

      if (isNaN(eventStart) || isNaN(eventEnd) || eventEnd <= eventStart) {
        row.push("")
        continue
      }

      const duracionEvento = eventEnd - eventStart

      const registros = asistencia.filter(
        a => a.matricula === alumno.matricula && a.idEvento === evento.idEvento
      )

      let tiempoTotal = 0

      for (const reg of registros) {
        if (!reg.fecha_llegada || !reg.fecha_salida) continue

        let entrada = new Date(reg.fecha_llegada).getTime()
        let salida = new Date(reg.fecha_salida).getTime()

        if (isNaN(entrada) || isNaN(salida)) continue

        if (entrada > salida) [entrada, salida] = [salida, entrada]

        entrada = Math.max(entrada, eventStart)
        salida = Math.min(salida, eventEnd)

        if (salida > entrada) tiempoTotal += salida - entrada
      }

      if (tiempoTotal === 0) {
        row.push("")
      } else {
        const porcentaje = Math.min(100, Math.round((tiempoTotal / duracionEvento) * 100))
        row.push(`${porcentaje}%`)
      }
    }

    sheet2Rows.push(row)
  }

  const ws2 = XLSX.utils.aoa_to_sheet([
    header1Sheet2,
    header2Sheet2,
    ...sheet2Rows,
  ])

  ws2["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // Datos del Alumno
  ]

  let colOffset = generalHeaders.length
  for (const evs of Object.values(eventosPorFecha)) {
    const count = evs.length
    if (count > 1) {
      ws2["!merges"].push({
        s: { r: 0, c: colOffset },
        e: { r: 0, c: colOffset + count - 1 },
      })
    }
    colOffset += count
  }

  const data2 = [header1Sheet2, header2Sheet2, ...sheet2Rows]
  ws2["!cols"] = autoFitColumns(data2)
  applyStyles(ws2)

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws1, "Asistencia")
  XLSX.utils.book_append_sheet(wb, ws2, "Cumplimiento")

  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
  saveAs(new Blob([buffer]), "SIMPOSIUM_ASISTENCIA.xlsx")
}
