import { useVlsm } from '../hooks/UseVlsm';

export function Vlsm() {
  const { base, setBase, rows, addRow, updateRow, removeRow, result, n2ip, maskOf } = useVlsm();

  return (
    <section id="v-vlsm" style={{ padding: '1.5rem 1rem 3rem', maxWidth: '68rem', margin: 'auto' }}>
      <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 800, margin: '0 0 .6rem' }}>Planificador VLSM</h1>
      <p className="sub" style={{ color: 'var(--mu)', marginBottom: '1.5rem' }}>
        Indicá la red base y cuántos hosts necesita cada subred. Se asignan de mayor a menor sin solapamientos.
      </p>
      
      <div className="form" style={{ display: 'flex', alignItems: 'center', gap: '.4rem', maxWidth: '34rem', background: 'var(--pn)', border: '1px solid var(--ln)', borderRadius: '14px', padding: '.35rem .7rem', marginBottom: '2rem' }}>
        <input 
          className="m" 
          aria-label="Red base" 
          value={base} 
          onChange={(e) => setBase(e.target.value)}
          style={{ flex: '1 1 14rem', border: 0, background: 'transparent', fontSize: '1.1rem' }} 
        />
      </div>

      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '2.5rem 0 1rem' }}>Subredes necesarias</h2>
      
      <div id="rows" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
        {rows.map((row, index) => (
          <div key={row.id} className="row" style={{ display: 'grid', gridTemplateColumns: '1fr 7rem auto', gap: '.5rem', maxWidth: '34rem' }}>
            <input 
              value={row.name} 
              onChange={(e) => updateRow(row.id, 'name', e.target.value)}
              aria-label={`Nombre de la subred ${index + 1}`} 
              placeholder="Nombre"
              style={{ padding: '.6rem .8rem', borderRadius: '10px', border: '1px solid var(--ln)', background: 'var(--pn)', color: 'var(--tx)' }}
            />
            <input 
              className="m" 
              type="number" 
              min="1" 
              value={row.hosts}
              onChange={(e) => updateRow(row.id, 'hosts', e.target.value)}
              aria-label={`Hosts necesarios en la subred ${index + 1}`}
              style={{ padding: '.6rem .8rem', borderRadius: '10px', border: '1px solid var(--ln)', background: 'var(--pn)', color: 'var(--tx)', fontFamily: 'var(--mono)' }}
            />
            <button 
              className="btn" 
              onClick={() => removeRow(row.id)}
              aria-label={`Quitar subred ${index + 1}`}
              style={{ padding: '.5rem 1rem', borderRadius: '10px', border: '1px solid var(--ln)', background: 'var(--pn)', cursor: 'pointer', fontWeight: 700 }}
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      <div className="acts" style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <button className="btn" onClick={addRow} style={{ padding: '.5rem 1rem', borderRadius: '10px', border: '1px solid var(--ln)', background: 'var(--pn)', fontWeight: 700, cursor: 'pointer' }}>
          Agregar subred
        </button>
        <button className="btn pri" style={{ padding: '.5rem 1rem', borderRadius: '10px', border: '1px solid var(--pri)', background: 'var(--pri)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          Guardar proyecto
        </button>
      </div>

      <div id="vout">
        {result.error && <p className="err" style={{ color: 'var(--err)', background: 'color-mix(in srgb,var(--err) 10%,transparent)', padding: '.55rem .85rem', borderRadius: '10px', fontWeight: 600 }}>{result.error}</p>}
        {result.fail && <p className="err" style={{ color: 'var(--err)', background: 'color-mix(in srgb,var(--err) 10%,transparent)', padding: '.55rem .85rem', borderRadius: '10px', fontWeight: 600 }}>{result.fail}</p>}
        
        {!result.error && result.res && (
          <>
            <div className="space" role="img" aria-label="Uso del espacio de direcciones" style={{ display: 'flex', height: '2.8rem', border: '1px solid var(--ln)', borderRadius: '12px', overflow: 'hidden', margin: '1.25rem 0 .5rem', background: 'var(--pn)', gap: '2px' }}>
              {result.res.map((r, i) => (
                <div 
                  key={r.id}
                  style={{ width: `${(r.size / result.total!) * 100}%`, background: `hsl(${(i * 57 + 215) % 360} 65% 62%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.82rem', color: '#0b1220', fontWeight: 700, overflow: 'hidden', whiteSpace: 'nowrap' }} 
                  title={`${r.name}: /${r.p}`}
                >
                  {(r.size / result.total!) > 0.1 ? r.name : ""}
                </div>
              ))}
              {result.total! > result.used! && (
                <div className="free" style={{ width: `${((result.total! - result.used!) / result.total!) * 100}%`, background: 'repeating-linear-gradient(135deg,transparent 0 6px,var(--ln) 6px 7px)', color: 'var(--mu)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.82rem', fontWeight: 500 }}>
                  libre
                </div>
              )}
            </div>
            
            <p className="sub" style={{ color: 'var(--mu)', marginBottom: '1.5rem' }}>
              Usás {result.used!.toLocaleString("es-AR")} de {result.total!.toLocaleString("es-AR")} direcciones ({Math.round((result.used! / result.total!) * 100)}%).
            </p>

            <div className="scroll" style={{ overflowX: 'auto', border: '1px solid var(--ln)', borderRadius: '16px', background: 'var(--pn)', marginTop: '1rem' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '.9rem', textAlign: 'left' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '.65rem 1rem', background: 'var(--bg2)', color: 'var(--mu)', fontWeight: 700, borderBottom: '1px solid var(--ln)' }}>Subred</th>
                    <th style={{ padding: '.65rem 1rem', background: 'var(--bg2)', color: 'var(--mu)', fontWeight: 700, borderBottom: '1px solid var(--ln)' }}>Pedidos</th>
                    <th style={{ padding: '.65rem 1rem', background: 'var(--bg2)', color: 'var(--mu)', fontWeight: 700, borderBottom: '1px solid var(--ln)' }}>Red</th>
                    <th style={{ padding: '.65rem 1rem', background: 'var(--bg2)', color: 'var(--mu)', fontWeight: 700, borderBottom: '1px solid var(--ln)' }}>Máscara</th>
                    <th style={{ padding: '.65rem 1rem', background: 'var(--bg2)', color: 'var(--mu)', fontWeight: 700, borderBottom: '1px solid var(--ln)' }}>Hosts</th>
                    <th style={{ padding: '.65rem 1rem', background: 'var(--bg2)', color: 'var(--mu)', fontWeight: 700, borderBottom: '1px solid var(--ln)' }}>Broadcast</th>
                    <th style={{ padding: '.65rem 1rem', background: 'var(--bg2)', color: 'var(--mu)', fontWeight: 700, borderBottom: '1px solid var(--ln)' }}>Útiles</th>
                  </tr>
                </thead>
                <tbody>
                  {result.res.map((r) => (
                    <tr key={r.id}>
                      <td style={{ padding: '.65rem 1rem', borderBottom: '1px solid var(--ln)' }}>{r.name}</td>
                      <td className="m" style={{ padding: '.65rem 1rem', borderBottom: '1px solid var(--ln)', fontFamily: 'var(--mono)' }}>{r.h}</td>
                      <td className="m" style={{ padding: '.65rem 1rem', borderBottom: '1px solid var(--ln)', fontFamily: 'var(--mono)' }}>{n2ip(r.net)}/{r.p}</td>
                      <td className="m" style={{ padding: '.65rem 1rem', borderBottom: '1px solid var(--ln)', fontFamily: 'var(--mono)' }}>{n2ip(maskOf(r.p))}</td>
                      <td className="m" style={{ padding: '.65rem 1rem', borderBottom: '1px solid var(--ln)', fontFamily: 'var(--mono)' }}>{n2ip(r.net + 1)} a {n2ip(r.bc - 1)}</td>
                      <td className="m" style={{ padding: '.65rem 1rem', borderBottom: '1px solid var(--ln)', fontFamily: 'var(--mono)' }}>{n2ip(r.bc)}</td>
                      <td className="m" style={{ padding: '.65rem 1rem', borderBottom: '1px solid var(--ln)', fontFamily: 'var(--mono)' }}>{r.size - 2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}