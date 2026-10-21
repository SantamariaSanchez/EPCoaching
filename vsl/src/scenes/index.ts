import React from "react";
import { SceneProps } from "../lib/props";
import { Scene1 } from "./Scene1";
import { Scene2 } from "./Scene2";
import { Scene3 } from "./Scene3";
import { Scene4 } from "./Scene4";
import { Scene5 } from "./Scene5";
import { Scene6 } from "./Scene6";
import { Scene7 } from "./Scene7";

export const SCENES: Record<number, React.FC<SceneProps>> = {
  1: Scene1,
  2: Scene2,
  3: Scene3,
  4: Scene4,
  5: Scene5,
  6: Scene6,
  7: Scene7,
};
