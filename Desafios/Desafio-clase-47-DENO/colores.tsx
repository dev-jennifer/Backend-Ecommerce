import { React } from "./deps.ts";

function Colores(e) {
  const color = e.prop;
  return <li style={{ color: color }}>{color}</li>;
}

export default Colores;
