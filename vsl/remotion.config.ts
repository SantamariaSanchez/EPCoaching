/**
 * Configuration du rendu de la VSL EP Coaching.
 * (Les API Node de Remotion n'utilisent pas ce fichier ; la CLI, si.)
 */
import { Config } from "@remotion/cli/config";
import { existsSync } from "node:fs";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
Config.setConcurrency(null);

// Navigateur : Remotion télécharge le sien automatiquement. Sur une machine sans accès
// à ce téléchargement, on peut indiquer un Chrome/Chromium local via REMOTION_CHROME.
const chrome = process.env.REMOTION_CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (existsSync(chrome)) {
  Config.setBrowserExecutable(chrome);
}
