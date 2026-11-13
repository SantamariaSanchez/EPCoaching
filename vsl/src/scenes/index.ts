import React from "react";
import { SceneProps } from "../lib/props";
import { S1, S2, S3, S4, S5 } from "../v2/Scenes";

// VSL v2 (13/11/2026) : 5 scènes, typographie cinétique + cartes en verre 3D.
// Les anciennes scènes (Scene1.tsx à Scene7.tsx, version 9 minutes) restent dans le dossier pour mémoire.
export const SCENES: Record<number, React.FC<SceneProps>> = {
  1: S1,
  2: S2,
  3: S3,
  4: S4,
  5: S5,
};
