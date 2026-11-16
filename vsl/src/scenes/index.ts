import React from "react";
import { SceneProps } from "../lib/props";
import { SCENES_V3 } from "../v3/Scenes";

// VSL v3 (16/11/2026) : 14 scènes, 5 minutes, structure de VSL indirecte (méthode Mason Ndiaye).
// Moteur rapide : texte calé mot à mot, coupes franches, un visuel à la fois, 2D uniquement.
export const SCENES: Record<number, React.FC<SceneProps>> = SCENES_V3;
