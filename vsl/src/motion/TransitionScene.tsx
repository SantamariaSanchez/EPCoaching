import React from "react";
import { AbsoluteFill } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { Rideau } from "./Beats";
import { Theme } from "./tokens";

type P = { vers: Theme; sens?: 1 | -1; duree: number };

// Transition entre scènes : le rideau de bandes (même langage que dans les scènes). Le plan sortant
// pousse légèrement vers l'avant, le rideau couvre 100 % de l'image au point de coupe, puis la scène
// suivante se découvre. Jamais de fondu enchaîné : deux textes ne se superposent jamais.
const RideauComp: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const f = presentationProgress * passedProps.duree;
  const centre = passedProps.duree / 2;
  if (presentationDirection === "exiting") {
    return <AbsoluteFill style={{ scale: `${1 + presentationProgress * 0.05}`, opacity: f < centre ? 1 : 0 }}>{children}</AbsoluteFill>;
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: f >= centre ? 1 : 0, scale: `${1.04 - 0.04 * presentationProgress}` }}>{children}</AbsoluteFill>
      <Rideau f={f} centre={centre} vers={passedProps.vers} sens={passedProps.sens} />
    </AbsoluteFill>
  );
};

export const rideauScene = (props: P): TransitionPresentation<P> => ({ component: RideauComp, props });
