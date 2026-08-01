/**
 * Rachas de escritura a partir del historial de git.
 *
 * No se guarda ninguna estadística: el repo ya sabe qué días escribiste, así
 * que se deduce del historial. Cero estado nuevo que pueda desincronizarse.
 */

export type Racha = {
  actual: number;
  mejor: number;
  diasActivos: number;
  ultimos: { dia: string; commits: number }[];
};

/** Fecha local en formato AAAA-MM-DD. Local, no UTC: si escribes a las 00:30 cuenta como hoy. */
export function diaLocal(fecha: Date): string {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function restarDias(dia: string, n: number): string {
  const [y, m, d] = dia.split("-").map(Number);
  const f = new Date(y, m - 1, d);
  f.setDate(f.getDate() - n);
  return diaLocal(f);
}

/**
 * @param fechasISO fechas de commit
 * @param hoy día de referencia, para poder probarlo sin depender del reloj
 */
export function calcularRacha(fechasISO: string[], hoy = diaLocal(new Date())): Racha {
  const porDia = new Map<string, number>();
  for (const iso of fechasISO) {
    const dia = diaLocal(new Date(iso));
    porDia.set(dia, (porDia.get(dia) ?? 0) + 1);
  }

  const dias = [...porDia.keys()].sort();

  // Racha actual: se cuenta hacia atrás desde hoy. Si hoy aún no has escrito
  // pero ayer sí, la racha sigue viva — el día no ha terminado.
  let actual = 0;
  let cursor = porDia.has(hoy) ? hoy : restarDias(hoy, 1);
  if (porDia.has(cursor)) {
    while (porDia.has(cursor)) {
      actual++;
      cursor = restarDias(cursor, 1);
    }
  }

  let mejor = 0;
  let seguidos = 0;
  let anterior: string | null = null;
  for (const dia of dias) {
    seguidos = anterior && restarDias(dia, 1) === anterior ? seguidos + 1 : 1;
    if (seguidos > mejor) mejor = seguidos;
    anterior = dia;
  }

  const ultimos = Array.from({ length: 14 }, (_, i) => {
    const dia = restarDias(hoy, 13 - i);
    return { dia, commits: porDia.get(dia) ?? 0 };
  });

  return { actual, mejor, diasActivos: dias.length, ultimos };
}
