import { useState, useEffect } from 'react';
import './index.css';
import { useCalculadora } from './hooks/useCalculadora';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calculadora' | 'vlsm' | 'proyectos'>('calculadora');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const { ipStr, setIpStr, cidrStr, setCidrStr, result } = useCalculadora();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const renderBits = () => {
    if (!result?.bin) return null;
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
        <div key={o} className="flex flex-col gap-1">
          <div className="oct">{bits}</div>
          <div className="dec">{(result.ipInt! >>> (24 - o * 8)) & 255}</div>
        </div>
      );
    }
    return octets;
  };

  return (
    <>
      <header>
        <div className="bar">
          <div className="brand"><span className="logo">/24</span>Subredes</div>
          <nav>
            <button className={activeTab === 'calculadora' ? 'active' : ''} onClick={() => setActiveTab('calculadora')}>Calculadora</button>
            <button className={activeTab === 'vlsm' ? 'active' : ''} onClick={() => setActiveTab('vlsm')}>VLSM</button>
            <button className={activeTab === 'proyectos' ? 'active' : ''} onClick={() => setActiveTab('proyectos')}>Mis proyectos</button>
          </nav>
          <button className="btn" onClick={toggleTheme}>Tema</button>
          <button className="btn pri">Iniciar sesión</button>
        </div>
      </header>

      <main>
        {activeTab === 'calculadora' && (
          <section>
            <div className="hero">
              <h1>Planificá tus subredes sin errores.</h1>
              <p className="sub">Calculá red, máscara, broadcast y rango de hosts al instante, y dividí tu red con VLSM. Todo se resuelve en tu navegador.</p>
              
              <div className="form">
                <input 
                  className="m" 
                  value={ipStr ?? ''} 
                  onChange={e => setIpStr(e.target.value)} 
                  placeholder="192.168.10.37" 
                />
                <span className="slash">/</span>
                <input 
                  className="m" 
                  value={cidrStr ?? ''} 
                  onChange={e => setCidrStr(e.target.value)} 
                  style={{ width: '4rem' }} 
                  maxLength={2} 
                />
              </div>
              {result?.err && <p className="err">{result.err}</p>}
            </div>

            {!result?.err && (
              <div>
                <div className="bits">{renderBits()}</div>
                <div className="legend">
                  <span><i style={{ background: 'var(--net)' }}></i>Bits de red</span>
                  <span><i style={{ background: 'var(--host)' }}></i>Bits de host</span>
                  <span>Tocá un bit para mover el prefijo.</span>
                </div>

                <dl className="res">
                  <div className="item"><span className="k">Dirección de red</span><span className="v mono">{result?.network}</span></div>
                  <div className="item"><span className="k">Máscara</span><span className="v mono">{result?.netmask}</span></div>
                  <div className="item"><span className="k">Wildcard</span><span className="v mono">{result?.wildcard}</span></div>
                  <div className="item"><span className="k">Broadcast</span><span className="v mono">{result?.broadcast}</span></div>
                  <div className="item"><span className="k">Primer host</span><span className="v mono">{result?.firstHost}</span></div>
                  <div className="item"><span className="k">Último host</span><span className="v mono">{result?.lastHost}</span></div>
                  <div className="item"><span className="k">Hosts útiles</span><span className="v mono">{result?.hosts}</span></div>
                  <div className="item"><span className="k">Tipo</span><span className="v mono">{result?.type}</span></div>
                </dl>

                <div className="acts">
                  <button className="btn pri">Guardar cálculo</button>
                  <button className="btn">Copiar resumen</button>
                  <button className="btn">Exportar a PDF</button>
                </div>
              </div>
            )}

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
            
            <h2>Planes</h2>
            <div className="plans">
              <div className="plan">
                <h3>Free</h3>
                <p className="text-3xl font-extrabold tracking-tight">USD 0</p>
                <button className="btn pri w-fit">Crear cuenta gratis</button>
              </div>
              <div className="plan pro">
                <h3>Pro <span className="tag">Próximamente</span></h3>
                <p className="text-3xl font-extrabold tracking-tight">Lista de espera</p>
                <button className="btn w-fit">Avisarme cuando salga</button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'vlsm' && (
          <section>
            <h1>Planificador VLSM</h1>
            <p className="sub">Módulo en construcción: Acá implementaremos la subdivisión dinámica.</p>
          </section>
        )}

        {activeTab === 'proyectos' && (
          <section>
            <h1>Mis proyectos</h1>
            <p className="sub">Iniciá sesión para ver tus proyectos guardados.</p>
          </section>
        )}
      </main>
    </>
  );
}