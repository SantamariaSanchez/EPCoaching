import React from "react";
import { AbsoluteFill } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { C } from "../lib/brand";
import { LightLeak } from "./Fond";

type P = { sens?: 1 | -1 };

// Transition de marque : le plan suivant s'ouvre dans un losange (le ◆ du logo EP)
// bordé d'un filet rouge, pendant qu'une fuite de lumière rouge traverse l'image.
const LosangeComp: React.FC<TransitionPresentationComponentProps<P>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps,
}) => {
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill style={{ scale: `${1 + p * 0.06}`, filter: `brightness(${1 - p * 0.55})` }}>{children}</AbsoluteFill>
    );
  }
  const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  const r = e * 1560;
  const poly = `polygon(960px ${540 - r}px, ${960 + r}px 540px, 960px ${540 + r}px, ${960 - r}px 540px)`;
  const side = r * Math.SQRT2;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: poly, scale: `${1.08 - 0.08 * e}` }}>{children}</AbsoluteFill>
      {e < 0.995 ? (
        <div
          style={{
            position: "absolute",
            left: 960 - side / 2,
            top: 540 - side / 2,
            width: side,
            height: side,
            rotate: "45deg",
            border: `${4 + 6 * (1 - e)}px solid ${C.rouge}`,
            opacity: 1 - e * 0.6,
          }}
        />
      ) : null}
      <LightLeak p={p} sens={passedProps.sens ?? 1} force={0.9} />
    </AbsoluteFill>
  );
};

export const losange = (props: P = {}): TransitionPresentation<P> => ({ component: LosangeComp, props });
