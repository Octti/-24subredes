import { useState, useEffect } from 'react';
import './App.css'; // Acordate de pegar todo el CSS del <style> de tu HTML acá
import { Vlsm } from './components/Vlsm';
// import { Calculadora } from './components/Calculadora'; // Lo descomentamos cuando lo hagamos
// import { Proyectos } from './components/Proyectos'; // Lo descomentamos cuando lo hagamos

function App() {
  const [activeTab, setActiveTab] = useState<'calculadora' | 'vlsm' | 'proyectos'>('vlsm');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {

    // Detecta el tema del sistema o guarda el último elegido
    
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  });
  const [user, setUser] = useState<string | null>(null);

  // Efecto para aplicar el tema en el <html> y reflejar el CSS
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = () => {
    if (user) {
      setUser(null);
    } else {
      setUser('demo@empresa.com'); 
    }
  };

  return (
    <>
      <header>
        <div className="bar">
          <div className="brand">
            <span className="logo">/24</span>Subredes
          </div>
          
          <nav aria-label="Principal">
            <a 
              href="#calculadora" 
              onClick={(e) => { e.preventDefault(); setActiveTab('calculadora'); }}
              aria-current={activeTab === 'calculadora' ? 'page' : undefined}
            >
              Calculadora
            </a>
            <a 
              href="#vlsm" 
              onClick={(e) => { e.preventDefault(); setActiveTab('vlsm'); }}
              aria-current={activeTab === 'vlsm' ? 'page' : undefined}
            >
              VLSM
            </a>
            <a 
              href="#proyectos" 
              onClick={(e) => { e.preventDefault(); setActiveTab('proyectos'); }}
              aria-current={activeTab === 'proyectos' ? 'page' : undefined}
            >
              Mis proyectos
            </a>
          </nav>
          
          <button className="btn" id="theme" onClick={toggleTheme} aria-label="Cambiar entre modo claro y oscuro">
            Tema
          </button>
          
          <button className="btn pri" id="user" onClick={handleLogin}>
            {user ? `Salir (${user.split('@')[0]})` : 'Iniciar sesión'}
          </button>
        </div>
      </header>

      <main>
        {activeTab === 'calculadora' && (
          <section id="v-calculadora" style={{ padding: '1.5rem 1rem', maxWidth: '68rem', margin: 'auto' }}>
            <h2>Calculadora de Subredes (En construcción 🚧)</h2>
            <p className="sub">Acá vamos a meter el componente de la calculadora de IPs.</p>
          </section>
        )}

        {activeTab === 'vlsm' && <Vlsm />}

        {activeTab === 'proyectos' && (
          <section id="v-proyectos" style={{ padding: '1.5rem 1rem', maxWidth: '68rem', margin: 'auto' }}>
            <h1>Mis proyectos</h1>
            <p className="sub" id="plan">
              {user ? "Plan Free: 0 de 5 proyectos." : "Iniciá sesión para guardar y recuperar tus proyectos."}
            </p>
            <ul className="plist" id="plist">
              <li className="empty">Todavía no guardaste nada. Hacé un cálculo y tocá Guardar.</li>
            </ul>
          </section>
        )}
      </main>

      <footer>
        Todo se calcula en tu navegador: ninguna dirección se envía a un servidor. 
        Esta versión es una demo, y la sesión y los proyectos viven solo en este dispositivo.
      </footer>
    </>
  );
}

export default App;