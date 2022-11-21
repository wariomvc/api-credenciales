export const templateRegistro = (nombre: string, apellido: string, codigo: string) => {
  return {
    text: `${nombre} ${apellido} Ya formas parte del Club de Exa KIDS.`,
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
          <p style="font-size: 20px;">${nombre} ${apellido} Ya formas parte del Club de Exa kids.</p>
          <p style="font-size: 20px;">
            Comenzaremos a trabajar en tu credencial lo mas pronto posible, te avisaremos cuando se
            encuentre lista para que la puedas recoger.
          </p>
          <p style="font-size: 20px;">
            Tu numero de socio es: ${codigo}. Recuérdalo muy bien, ya que con este numero podrás
            acceder a increíbles premios en cabina en la hora de los Exa kids
          </p>
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
