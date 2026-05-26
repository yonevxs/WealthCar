const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const BUCKET = "car-images";

export function getCarImageUrl(
  marca:  string,
  modelo: string,
  ano:    number
): string {
  const slug = `${marca}-${modelo}`
    .toLowerCase()
    .normalize("NFD")                        // remove acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")                    // espaços → hífens
    .replace(/[^a-z0-9-]/g, "");            // remove caracteres especiais

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${slug}.png`;
}

// Exemplos de slug gerados:
// "Mitsubishi", "Lancer Evolution", 2014 → "mitsubishi-lancer-evolution-2014"