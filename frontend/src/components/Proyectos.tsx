import { useState } from 'react';

// Interfaz provisoria hasta que la conectemos con el backend
interface Proyecto {
  id: string;
  name: string;
  type: 'calculadora' | 'vlsm';
  date: string;
}

export function Proyectos() {
  // Estado provisorio simulando lo que vendrá del backend
  const [proyectos, setProyectos] = useState<Proyecto[]>([
    { id: '1', name: '172.16.8.0/21', type: 'calculadora', date: '4/11/2026' },
    { id: '2', name: '10.20.0.0/22', type: 'calculadora', date: '2/11/2026' },
    { id: '3', name: 'VLSM 192.168.0.0/24', type: 'vlsm', date: '28/10/2026' }
  ]);

  const maxFreeProjects = 5;

  const handleEliminar = (id: string) => {
    // Acá en el futuro irá un fetch(DELETE) al backend
    setProyectos(proyectos.filter(p => p.id !== id));
  };

  const handleAbrir = (id: string) => {
    // Acá en el futuro inyectaremos los datos guardados en los inputs correspondientes
    console.log(`Abriendo proyecto ${id}...`);
  };

  return (
    <section id="v-proyectos" style={{ padding: '1.5rem 1rem 3rem', maxWidth: '68rem', margin: 'auto' }}>
      <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 800, margin: '0 0 .6rem' }}>Mis proyectos</h1>
      <p className="sub" style={{ color: 'var(--mu)', marginBottom: '1.5rem' }}>
        Plan Free: {proyectos.length} de {maxFreeProjects} proyectos.
      </p>

      <ul className="plist" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '.75rem' }}>
        {proyectos.length > 0 ? (
          proyectos.map(p => (
            <li 
              key={p.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '.75rem', 
                flexWrap: 'wrap', 
                padding: '.9rem 1.1rem', 
                border: '1px solid var(--ln)', 
                borderRadius: '14px', 
                background: 'var(--pn)', 
                boxShadow: 'var(--sh)' 
              }}
            >
              <span className="nm" style={{ flex: '1 1 12rem', fontWeight: 700 }}>{p.name}</span>
              <span className="tag" style={{ fontSize: '.78rem', fontWeight: 700, padding: '.1rem .6rem', borderRadius: '2rem', background: 'var(--net-bg)', color: 'var(--net)' }}>
                {p.type === 'vlsm' ? 'VLSM' : 'Calculadora'}
              </span>
              <span className="k" style={{ color: 'var(--mu)', fontWeight: 600, fontSize: '.92rem', marginRight: 'auto' }}>{p.date}</span>
              
              <button 
                className="btn" 
                onClick={() => handleAbrir(p.id)}
                style={{ padding: '.5rem 1rem', borderRadius: '10px', border: '1px solid var(--ln)', background: 'var(--pn)', fontWeight: 700, cursor: 'pointer' }}
              >
                Abrir
              </button>
              <button 
                className="btn" 
                onClick={() => handleEliminar(p.id)}
                style={{ padding: '.5rem 1rem', borderRadius: '10px', border: '1px solid var(--ln)', background: 'var(--pn)', fontWeight: 700, cursor: 'pointer' }}
              >
                Eliminar
              </button>
            </li>
          ))
        ) : (
          <li 
            className="empty" 
            style={{ 
              color: 'var(--mu)', 
              padding: '.9rem 1.1rem', 
              border: '1px dashed var(--ln)', 
              borderRadius: '14px', 
              background: 'var(--pn)' 
            }}
          >
            Todavía no guardaste nada. Hacé un cálculo y tocá Guardar.
          </li>
        )}
      </ul>
    </section>
  );
}