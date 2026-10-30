export interface SubnetResult {
  ip: string;
  cidr: number;
  network: string;
  netmask: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
}