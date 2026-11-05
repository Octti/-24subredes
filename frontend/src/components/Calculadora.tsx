import { useCalculadora } from '../hooks/useCalculadora';
import { Faq } from './Faq';

// Funciones auxiliares internas para calcular la lista de hosts sin depender de tu hook
const ipToNum = (ip: string) => ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
const numToIp = (n: number) => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");

export function Calculadora() {
  // Consumimos tu hook exactamente como lo tenés definido
  const { ipStr, setIpStr, cidrStr, setCidrStr, result } = useCalculadora();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Función para renderizar los octetos
  const renderBits = () => {
    if (!result.bin) return null;
    const octets = [];
    for (let o = 0; o < 4; o++) {
      const bits = [];
      for (let i = o * 8; i < o * 8 + 8; i++) {
        const isNetwork = i < (result.c || 0);
        bits.push(
          <button 
            key={i} 
            className={`bit ${isNetwork ? 'n' : 'h'}`}
            onClick={() => setCidrStr((i + 1).toString())}
            title={`Fijar prefijo en /${i + 1}`}
          >
            {result.bin[i]}
          </button>
        );
      }
      octets.push(
        <div key={o} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div className="oct">{bits}</div>
          <div className="dec">{(result.ipInt! >>> (24 - o * 8)) & 255}</div>
        </div>
      );
    }
    return octets;
  };

  // Preparar cálculos numéricos seguros para la tabla de hosts
  const numericHosts = result.hosts ? parseInt(result.hosts.replace(/\./g, '')) : 0;
  const firstHostInt = result.firstHost ? ipToNum(result.firstHost) : 0;

  return (
    <section>
      <div className="hero">
        <h1>Planificá tus subredes sin errores.</h1>
        <p className="sub">Calculá red, máscara, broadcast y rango de hosts al instante, y dividí tu red con VLSM. Todo se resuelve en tu navegador.</p>
        
        <div className="form">
          <input 
            className="m" 
            value={ipStr} 
            onChange={e => setIpStr(e.target.value)} 
            placeholder="192.168.10.37" 
            id="ip"
          />
          <span className="slash">/</span>
          <input 
            className="m" 
            value={cidrStr} 
            onChange={e => setCidrStr(e.target.value)} 
            style={{ width: '4.4rem' }} 
            maxLength={2} 
            id="cidr"
          />
        </div>
        {result.err && <p className="err">{result.err}</p>}
      </div>

      {!result.err && result.bin && (
        <div id="out">
          <div className="bits">{renderBits()}</div>
          <div className="legend">
            <span><i style={{ background: 'var(--net)' }}></i>Bits de red</span>
            <span><i style={{ background: 'var(--host)' }}></i>Bits de host</span>
            <span>Tocá un bit para mover el prefijo.</span>
          </div>

          <dl className="res">
            <button className="item" onClick={() => handleCopy(`${result.network}/${result.c}`)}>
              <span className="k">Dirección de red</span><span className="v mono">{result.network}/{result.c}</span>
            </button>
            <button className="item" onClick={() => handleCopy(result.netmask)}>
              <span className="k">Máscara</span><span className="v mono">{result.netmask}</span>
            </button>
            <button className="item" onClick={() => handleCopy(result.wildcard)}>
              <span className="k">Wildcard</span><span className="v mono">{result.wildcard}</span>
            </button>
            <button className="item" onClick={() => handleCopy(result.broadcast)}>
              <span className="k">Broadcast</span><span className="v mono">{result.broadcast}</span>
            </button>
            <button className="item" onClick={() => handleCopy(result.firstHost)}>
              <span className="k">Primer host</span><span className="v mono">{result.firstHost}</span>
            </button>
            <button className="item" onClick={() => handleCopy(result.lastHost)}>
              <span className="k">Último host</span><span className="v mono">{result.lastHost}</span>
            </button>
            <button className="item" onClick={() => handleCopy(result.hosts)}>
              <span className="k">Hosts útiles</span><span className="v mono">{result.hosts}</span>
            </button>
            <button className="item" onClick={() => handleCopy(result.type)}>
              <span className="k">Tipo</span><span className="v mono">{result.type}</span>
            </button>
          </dl>

          <div className="acts">
            <button className="btn pri">Guardar cálculo</button>
            <button className="btn" onClick={() => handleCopy(`Red: ${result.network}/${result.c}\nMáscara: ${result.netmask}\nBroadcast: ${result.broadcast}\nHosts: ${result.firstHost} a ${result.lastHost} (${result.hosts})`)}>
              Copiar resumen
            </button>
            <button className="btn" onClick={() => window.print()}>Exportar a PDF</button>
          </div>

          <details id="hd">
            <summary>Lista de hosts</summary>
            <div className="scroll" id="hosts">
              <table>
                <thead>
                  <tr><th>N.º</th><th>Dirección</th></tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.min(numericHosts, 256) }).map((_, k) => (
                    <tr key={k}>
                      <td>{k + 1}</td>
                      <td className="m">{numToIp(firstHostInt + k)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {numericHosts > 256 && (
                <p className="note">Se muestran los primeros 256 de {result.hosts} hosts.</p>
              )}
            </div>
          </details>
        </div>
      )}

      <h2>Cómo funciona</h2>
      <ol className="steps">
        <li><b>Ingresá una IP y un prefijo</b><span>Por ejemplo 192.168.10.37/26. Los resultados aparecen mientras tipeás.</span></li>
        <li><b>Ajustá los bits</b><span>Tocá cualquier bit para mover el prefijo y ver cómo cambia la red.</span></li>
        <li><b>Dividí con VLSM</b><span>Cargá los hosts que necesita cada subred y el planificador las acomoda sin solapamientos.</span></li>
        <li><b>Guardá y exportá</b><span>Con una cuenta gratuita guardás el proyecto y lo exportás a PDF.</span></li>
      </ol>

      <h2>Vista previa del plan Pro</h2>
      <div className="preview">
        <div>
          <h3>Diagrama de topología <span className="tag">Pro</span></h3>
          <p className="sub mt-2">Mirá cómo se reparte tu red base entre las subredes con un diagrama interactivo, y llevalo a tu documentación. Es una vista previa de una función en desarrollo.</p>
          <button className="btn">Avisarme cuando salga</button>
        </div>
        
        <svg className="diag" viewBox="0 0 470 250">
          <path className="dl" d="M158 125 C204 125 204 31 250 31"/>
          <path className="dl" d="M158 125 C204 125 204 93 250 93"/>
          <path className="dl" d="M158 125 C204 125 204 155 250 155"/>
          <path className="dl" d="M158 125 C204 125 204 217 250 217"/>
          
          <rect className="dn root" x="8" y="96" width="150" height="58" rx="12"/>
          <text className="dt" x="22" y="120">192.168.0.0/24</text>
          <text className="dm" x="22" y="139">256 direcciones</text>
          
          <rect className="dn" x="250" y="8" width="210" height="46" rx="10"/>
          <rect x="250" y="8" width="6" height="46" rx="3" fill="hsl(215 65% 62%)"/>
          <text className="dt" x="270" y="27">Ventas</text>
          <text className="dm" x="270" y="44">192.168.0.0/26, 62 hosts</text>
          
          <rect className="dn" x="250" y="70" width="210" height="46" rx="10"/>
          <rect x="250" y="70" width="6" height="46" rx="3" fill="hsl(272 65% 62%)"/>
          <text className="dt" x="270" y="89">Oficinas</text>
          <text className="dm" x="270" y="106">192.168.0.64/27, 30 hosts</text>
          
          <rect className="dn" x="250" y="132" width="210" height="46" rx="10"/>
          <rect x="250" y="132" width="6" height="46" rx="3" fill="hsl(329 65% 62%)"/>
          <text className="dt" x="270" y="151">Servidores</text>
          <text className="dm" x="270" y="168">192.168.0.96/28, 14 hosts</text>
          
          <rect className="dn" x="250" y="194" width="210" height="46" rx="10"/>
          <rect x="250" y="194" width="6" height="46" rx="3" fill="hsl(26 65% 62%)"/>
          <text className="dt" x="270" y="213">Enlace WAN</text>
          <text className="dm" x="270" y="230">192.168.0.112/30, 2 hosts</text>
        </svg>
      </div>
      
      <Faq />
      
      <h2>Planes</h2>
      <div className="plans">
        <div className="plan">
          <h3>Free</h3>
          <p className="price">USD 0</p>
          <ul>
            <li>Calculadora IPv4 sin límites</li>
            <li>Planificador VLSM</li>
            <li>Hasta 5 proyectos guardados</li>
            <li>Exportar a PDF</li>
          </ul>
          <button className="btn pri w-fit">Crear cuenta gratis</button>
        </div>
        <div className="plan pro">
          <h3>Pro <span className="tag">Próximamente</span></h3>
          <p className="price">Lista de espera</p>
          <ul>
            <li>Proyectos ilimitados</li>
            <li>Diagrama de topología</li>
            <li>Proyectos compartidos con tu equipo</li>
            <li>Soporte prioritario</li>
          </ul>
          <button className="btn w-fit">Avisarme cuando salga</button>
        </div>
      </div>
    </section>
  );
}