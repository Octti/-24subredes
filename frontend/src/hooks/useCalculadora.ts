import { useState, useMemo } from 'react';

const ip2n = (s: string) => {
  const p = s.trim().split(".");
  if (p.length !== 4 || p.some(x => !/^\d{1,3}$/.test(x) || +x > 255)) return null;
  return (((+p[0] << 24) >>> 0) + (+p[1] << 16) + (+p[2] << 8) + (+p[3])) >>> 0;
};

const n2ip = (n: number) => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
const maskOf = (c: number) => (c === 0 ? 0 : (0xffffffff << (32 - c)) >>> 0);
const cls = (n: number) => {
  const a = n >>> 24;
  return a < 128 ? "A" : a < 192 ? "B" : a < 224 ? "C" : a < 240 ? "D" : "E";
};
const kind = (n: number) => {
  const a = n >>> 24,
    b = (n >>> 16) & 255;
  if (a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168))
    return "privada";
  if (a === 127) return "loopback";
  if (a === 169 && b === 254) return "link-local";
  if (a >= 224 && a < 240) return "multicast";
  if (a >= 240 || a === 0) return "reservada";
  return "pública";
};

export function useCalculadora() {
  const [ipStr, setIpStr] = useState('192.168.10.37');
  const [cidrStr, setCidrStr] = useState('26');

  const result = useMemo(() => {
    const ip = ip2n(ipStr);
    const t = cidrStr.trim();
    const c = /^\d{1,2}$/.test(t) ? +t : -1;

    let err = "";
    if (ip === null)
      err = "La dirección necesita 4 números entre 0 y 255, por ejemplo 192.168.10.37.";
    else if (c < 0 || c > 32) err = "El prefijo tiene que estar entre 0 y 32.";

    if (err || ip === null) {
      return {
        err,
        c: 0,
        ipInt: 0,
        bin: "",
        network: "",
        netmask: "",
        wildcard: "",
        broadcast: "",
        firstHost: "",
        lastHost: "",
        hosts: "",
        type: ""
      };
    }

    const mask = maskOf(c);
    const net = (ip & mask) >>> 0;
    const wc = (~mask) >>> 0;
    const bc = (net | wc) >>> 0;

    let first, last, hosts;
    if (c === 32) {
      first = last = net;
      hosts = 1;
    } else if (c === 31) {
      first = net;
      last = bc;
      hosts = 2;
    } else {
      first = net + 1;
      last = bc - 1;
      hosts = 2 ** (32 - c) - 2;
    }

    const bin = ip.toString(2).padStart(32, "0");

    return {
      err: "",
      c,
      ipInt: ip,
      bin,
      network: `${n2ip(net)}/${c}`,
      netmask: n2ip(mask),
      wildcard: n2ip(wc),
      broadcast: n2ip(bc),
      firstHost: n2ip(first),
      lastHost: n2ip(last),
      hosts: hosts.toLocaleString("es-AR"),
      type: `Clase ${cls(ip)}, ${kind(ip)}`
    };
  }, [ipStr, cidrStr]);

  return { ipStr, setIpStr, cidrStr, setCidrStr, result };
}