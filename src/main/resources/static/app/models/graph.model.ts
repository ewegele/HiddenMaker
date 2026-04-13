export interface Node {
  id: string;
  label: string;
  type: string;
}

export interface Edge {
  source: string;
  target: string;
  relation: string;
}
