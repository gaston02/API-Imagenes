import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

export const compressImage = async (
  inputPath,
  maxWidth = 800,
  quality = 80,
  effort = 6
) => {
  try {
    // Verificar que exista el archivo original
    await fs.access(inputPath);

    // Extraer partes del path
    const dir = path.dirname(inputPath);
    const ext = path.extname(inputPath);
    const basename = path.basename(inputPath, ext);

    // Construir outputPath en el mismo directorio
    // Si vas a convertir a webp, aquí puedes cambiar ext a '.webp'
    const outputPath = path.join(dir, `compressed-${basename}${ext}`);

    console.log("🟢 Output path:", outputPath);

    // Procesar la imagen
    await sharp(inputPath)
      .resize({
        width: maxWidth,
        withoutEnlargement: true,
      })
      .toFormat("webp", { quality, effort }) // convierte a webp
      .toFile(outputPath);

    return outputPath; // Devolver path absoluto (luego en middleware sacamos solo el nombre)
  } catch (error) {
    throw new Error(`Error al procesar la imagen: ${error.message}`);
  }
};
