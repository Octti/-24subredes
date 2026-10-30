import { useState, useMemo } from 'react';

export interface SubnetReq {
  id: string;
  name: string;
  hosts: string;
}

// Funciones binarias extraídas del script original
const ip2n = (s: string) => {
  const p = s.trim().split(".");
  if (p.length !== 4 || p.some(x => !/^\d{1,3}$/.test(x) || +x > 255)) return null;
  return (((+p[0] << 24) >>> 0) + (+p[1] << 16) + (+p[2] << 8) + (+p[3])) >>> 0;
};

const n2ip = (n: number) => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
const maskOf = (c: number) => c === 0 ? 0 : (0xFFFFFFFF << (32 - c)) >>> 0;

export function useVlsm() {
  const [base, setBase] = useState("192.168.0.0/24");
  
  // Datos por defecto del proyecto original
  const [rows, setRows] = useState<SubnetReq[]>([
    { id: '1', name: "Ventas", hosts: "50" },
    { id: '2', name: "Oficinas", hosts: "25" },
    { id: '3', name: "Servidores", hosts: "10" },
    { id: '4', name: "Enlace WAN", hosts: "2" }
  ]);

  const addRow = () => setRows([...rows, { id: Date.now().toString(), name: `Subred ${rows.length + 1}`, hosts: "10" }]);
  
  const updateRow = (id: string, field: keyof SubnetReq, value: string) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };
  
  const removeRow = (id: string) => setRows(rows.filter(r => r.id !== id));

  const result = useMemo(() => {
    const m = base.trim().match(/^([\d.]+)\/(\d{1,2})$/);
    if (!m || ip2n(m[1]) === null || +m[2] > 30) {
      return { error: 'Ingresá una red base válida con prefijo hasta /30, por ejemplo 192.168.0.0/24.' };
    }

    const c = +m[2];
    const baseIp = (ip2n(m[1])! & maskOf(c)) >>> 0;
    const total = 2 ** (32 - c);

    const list = rows
      .map((r, i) => ({ ...r, name: r.name || `Subred ${i + 1}`, h: parseInt(r.hosts) || 0 }))
      .filter(r => r.h > 0)
      .sort((a, b) => b.h - a.h); // Acomoda de mayor a menor

    if (!list.length) return { error: 'Cada subred necesita al menos 1 host.' };

    let cur = 0;
    const res = [];
    let fail = "";

    for (const r of list) {
      const bits = Math.max(2, Math.ceil(Math.log2(r.h + 2)));
      const size = 2 ** bits;
      if (cur + size > total) {
        fail = `No hay espacio para “${r.name}” (${r.h} hosts). Ampliá la red base o reducí los pedidos.`;
        break;
      }
      const net = baseIp + cur;
      res.push({ ...r, net, size, p: 32 - bits, bc: net + size - 1 });
      cur += size;
    }

    const used = res.reduce((acc, r) => acc + r.size, 0);

    return { total, used, res, fail, c };
  }, [base, rows]);

  return { base, setBase, rows, addRow, updateRow, removeRow, result, n2ip, maskOf };
}