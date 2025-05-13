export function resetPasswordTemplate({ token }) {
  const resetLink = `https://picvaul.com/reset-password?token=${token}`;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Restablecimiento de Contraseña</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style type="text/css">
    /* Estilos generales */
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      box-sizing: border-box; /* Asegura que el padding no cause desbordamiento */
    }
    
    /* Estilos para la tabla principal */
    table {
      width: 100%;
      border: 0;
      cellspacing: 0;
      cellpadding: 0;
      background-color: #f7f7f7;
    }

    .responsive-table {
      width: 100%;
      max-width: 600px;
      background-color: #ffffff;
      border: 1px solid #ddd;
      margin: 0 auto;
      box-sizing: border-box; /* Asegura que el padding no cause desbordamiento */
    }

    .stack-column {
      display: table-cell;
      vertical-align: middle;
      padding: 20px;
      word-wrap: break-word; /* Asegura que el texto largo se divida */
      overflow-wrap: break-word; /* Asegura que el texto largo se divida */
      word-break: break-word; /* Asegura que las palabras largas se rompan */
      max-width: 100%;
    }

    /* Centrado de texto en dispositivos móviles */
    @media only screen and (max-width: 600px) {
      .responsive-table {
        width: 100% !important;
        max-width: 100% !important;
        padding: 10px !important; /* Agrega un pequeño padding para evitar que el contenido toque los bordes */
        box-sizing: border-box; /* Asegura que el padding esté dentro del ancho total */
      }

      .stack-column {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        text-align: center !important;
      }

      .stack-column img {
        width: 100% !important;
        height: auto !important;
        max-width: 100% !important; /* Asegura que la imagen no se desborde */
      }

      h2 {
        font-size: 22px !important;
      }

      p {
        font-size: 14px !important;
      }

      .button {
        padding: 12px 20px !important;
        font-size: 18px !important;
      }
    }

    /* Ajustes adicionales para pantallas entre 400px y 600px */
    @media only screen and (min-width: 400px) and (max-width: 599px) {
      .responsive-table {
        padding: 15px !important; /* Padding intermedio */
      }

      .stack-column {
        padding: 10px !important; /* Un poco más de espacio entre las columnas */
      }

      h2 {
        font-size: 20px !important; /* Ajusta el tamaño del título */
      }

      p {
        font-size: 15px !important; /* Ajusta el tamaño del párrafo */
      }

      .button {
        padding: 10px 18px !important; /* Botón de tamaño intermedio */
        font-size: 17px !important; /* Ajuste de tamaño de fuente del botón */
      }
    }

    /* Ajustes adicionales para pantallas muy pequeñas (menores a 400px) */
    @media only screen and (max-width: 400px) {
      .responsive-table {
        padding: 5px !important; /* Menos padding para ganar espacio */
      }

      .stack-column {
        padding: 5px !important; /* Menos padding en la columna */
      }

      h2 {
        font-size: 18px !important; /* Reduce el tamaño de la fuente del título */
      }

      p {
        font-size: 12px !important; /* Reduce el tamaño de la fuente del párrafo */
      }

      .button {
        padding: 10px 15px !important; /* Reduce el tamaño del botón */
        font-size: 16px !important; /* Reduce el tamaño de la fuente del botón */
      }
    }

    /* Botón estilizado */
    .button {
      background-color: #ff6079;
      color: #ffffff;
      padding: 8px 15px;
      text-decoration: none;
      border-radius: 4px;
      display: inline-block;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <table>
    <tr>
      <td align="center">
        <table class="responsive-table">
          <tr>
            <!-- Columna izquierda: Imagen -->
            <td class="stack-column">
              <img 
                src="https://imageshub-api.ddns.net/API-Imagenes/uploads/compressed-image-1743806724545-276418769.jpeg" 
                alt="Imagen de Reseteo" 
                style="width: 100%; height: auto; border: none;">
            </td>
            <!-- Columna derecha: Texto -->
            <td class="stack-column">
              <h2 style="color: #ff6079; margin-top: 0;">Restablecimiento de Contraseña</h2>
              <p style="font-size: 16px; color: #333;">
                Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para hacerlo:
              </p>
              <p>
                <a href="${resetLink}" class="button" target="_blank">
                  Restablecer Contraseña
                </a>
              </p>
              <p style="font-size: 16px; color: #333;">Este enlace expirará en 1 hora.</p>
              <p style="font-size: 16px; color: #333;">Si no solicitaste este cambio, simplemente ignora este correo.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
