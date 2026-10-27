import React, { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";
import { FONT } from "./tokens";

// Rien n'est mesuré ni affiché avant que Montserrat (toutes graisses) soit chargée :
// sinon fitText mesurerait la police de repli et le texte déborderait.
let pret = false;
const attente = (async () => {
  const graisses = [500, 600, 700, 800, 900];
  await Promise.all(graisses.map((g) => document.fonts.load(`${g} 100px ${FONT}`)));
  await Promise.all([document.fonts.load(`italic 800 100px ${FONT}`), document.fonts.load(`italic 900 100px ${FONT}`)]);
  await document.fonts.ready;
  pret = true;
})();

export const PolicesPretes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ok, setOk] = useState(pret);
  const [handle] = useState(() => (pret ? null : delayRender("polices")));
  useEffect(() => {
    if (ok) return;
    attente.then(() => {
      setOk(true);
      if (handle !== null) continueRender(handle);
    });
  }, [ok, handle]);
  return ok ? <>{children}</> : null;
};
