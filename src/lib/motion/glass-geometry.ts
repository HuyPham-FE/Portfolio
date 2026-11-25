// Each ribbon remains a consistently oriented strip: no inverted/self-intersecting morph.
export const RIBBON_WAVE =
  "M -220 670 C 130 330 340 675 810 675 C 1200 675 1420 390 1830 480 L 1830 555 C 1430 465 1210 755 810 755 C 340 755 130 425 -220 755 Z";
export const RIBBON_ORBIT =
  "M -220 610 C 160 280 360 650 810 690 C 1220 730 1420 440 1830 420 L 1830 500 C 1430 520 1220 810 810 770 C 360 730 160 375 -220 700 Z";
export const RIBBON_READY =
  "M -220 680 C 170 365 380 710 810 680 C 1220 650 1470 285 1830 330 L 1830 415 C 1470 370 1220 730 810 760 C 380 790 170 450 -220 770 Z";
export const RIBBON_EXIT =
  "M -220 760 C 170 445 380 790 810 760 C 1220 730 1470 365 1830 410 L 1830 495 C 1470 450 1220 810 810 840 C 380 870 170 530 -220 850 Z";
// Full-height curved seam: opens like glass curtains, not a growing circular hole.
export const IRIS_CLOSED =
  "M 800 -120 C 800 120 800 300 800 450 C 800 650 800 800 800 1020 L 800 1020 C 800 800 800 650 800 450 C 800 300 800 120 800 -120 Z";
export const IRIS_OPEN =
  "M -400 -120 C -550 120 -400 300 -500 450 C -480 650 -550 800 -400 1020 L 2000 1020 C 2150 800 2100 650 2100 450 C 2150 300 2100 120 2000 -120 Z";
export const GLASS_TIMING = {
  wake: 0,
  assemble: 0.8,
  flow: 1.8,
  focus: 2.9,
  gate: 3.8,
  revealThreshold: 3.8,
  heroReveal: 4.8,
  complete: 6.2,
} as const;
export const INTRO_SESSION_KEY = "huy-cinematic-intro-v3";
