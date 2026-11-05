export function Faq() {
  return (
    <>
      <h2>Preguntas frecuentes</h2>
      <div className="faq">
        <details>
          <summary>¿Se envían mis direcciones IP a algún servidor?</summary>
          <p>No. Los cálculos se hacen en tu navegador. En esta demo, tu sesión y tus proyectos se guardan solo en este dispositivo.</p>
        </details>
        <details>
          <summary>¿Qué es VLSM?</summary>
          <p>Es dividir una red en subredes de distinto tamaño según los hosts que necesita cada una, para no desperdiciar direcciones. El planificador las ordena de mayor a menor y las acomoda sin solapamientos.</p>
        </details>
        <details>
          <summary>¿Por qué una /24 tiene 254 hosts y no 256?</summary>
          <p>La primera dirección identifica la red y la última es el broadcast, así que no se pueden asignar a equipos. Las excepciones son /31, con 2 hosts para enlaces punto a punto, y /32, con 1 host.</p>
        </details>
        <details>
          <summary>¿Soporta IPv6?</summary>
          <p>Por ahora solo IPv4.</p>
        </details>
      </div>
    </>
  );
}