export const templateRegistro = (
  nombre: string,
  apellido: string,
  codigo: string,
  cuerpo: string,
) => {
  return {
    text:
      ` <div style="width: 80%; margin: 20px auto; text-align: center">
      <h2>${nombre} ${apellido}</h2>
          <div
            style="
              width: 50%;
               margin: 20px auto;
            "
          >
            <img src="cid:logo" alt="exakids logo"  style="width: 50%" />
          </div>
          <div style="width: 50%; margin: auto">
            ` +
      cuerpo +
      `            
          </div>
        </div>`,
    html:
      ` <div style="width: 80%; margin: 20px auto; text-align: center">
      <h2>${nombre} ${apellido}</h2>
          <div
            style="
              width: 50%;
              margin: 20px auto;
              
              
            "
          >
            <img src="cid:logo" alt="exakids logo"  style="width: 50%" />
          </div>
          <div style="width: 50%; margin: auto">
            ` +
      cuerpo +
      `            
          </div>
        </div>`,
  };
};

export const templateImpresion = (nombre: string, apellido: string, codigo: string) => {
  return {
    text: `${nombre} ${apellido} Tu Credencial ya esta impresa.`,
    html: ` <div style="width: 80%; margin: 20px auto; text-align: center">
        <div
          style="
            width: 50%;
            margin: 20px auto;
            background-color: rgb(220, 68, 16);
            border-radius: 30px;
          "
        >
          <img src="cid:logo" alt="exakids logo"  style="width: 50%" />
        </div>
        <div style="width: 50%; margin: auto">
          <h1>Te informamos que tu credencial ya fue impresa</h1>
          <p>Puedes pasar a recogerla.</p>
        </div>
      </div>`,
  };
};

export const templateGetCredencial = (nombre: string, apellido: string) => {
  return {
    text: `${nombre} ${apellido} te hemos enviado tu credencial  Club de Exa KIDS en este correo. Puedes descargarla e imprimirla .`,
    html: ` <div style="width: 80%; margin: 20px auto; text-align: center">
          <div
            style="
              width: 50%;
              margin: 20px auto;
              background-color: rgb(220, 68, 16);
              border-radius: 30px;
            "
          >
            <img src="cid:logo" alt="exakids logo"  style="width: 50%" />
          </div>
          <div style="width: 50%; margin: auto">
            <h1>Felicidades!!!</h1>
            <p style="font-size: 20px;">${nombre} ${apellido} Has solicitado la reposición de tu credencial.</p>
            <p style="font-size: 20px;">
              Tu credencial se encuentra adjunta a este correo. Esta en formato PDF. Puedes descargarla e imprimirla.
            </p>
            
          </div>
        </div>`,
  };
};
