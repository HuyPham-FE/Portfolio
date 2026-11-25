import { gsap } from "gsap";
/** Scroll owns the outer shell; hover owns the button. Never hide a skill with opacity. */
export function createSkillEntrance(root: HTMLElement) {
  const lab = root.querySelector<HTMLElement>(".skill-lab")!;
  const core = root.querySelector<HTMLElement>(".lab-core");
  const shells = [...root.querySelectorAll<HTMLElement>(".skill-burst")];
  const rotations = shells.map(
    (shell) => Number(gsap.getProperty(shell, "rotation")) || 0,
  );
  const compact = () => lab.clientWidth < 600;
  const origin = () =>
    core && core.offsetWidth > 0
      ? {
          x: core.offsetLeft + core.offsetWidth / 2,
          y: core.offsetTop + core.offsetHeight / 2,
        }
      : { x: lab.clientWidth / 2, y: lab.clientHeight / 2 };
  return gsap.fromTo(
    shells,
    {
      x: (_i: number, shell: HTMLElement) =>
        (origin().x - shell.offsetLeft - shell.offsetWidth / 2) *
        (compact() ? 0.55 : 1),
      y: (_i: number, shell: HTMLElement) =>
        (origin().y - shell.offsetTop - shell.offsetHeight / 2) *
        (compact() ? 0.55 : 1),
      z: () => (compact() ? -60 : -150),
      scale: () => (compact() ? 0.55 : 0.35),
      rotation: (i: number) => (i - 2) * 11,
      rotationY: () => (compact() ? 0 : -15),
    },
    {
      x: 0,
      y: 0,
      z: 0,
      scale: 1,
      rotation: (i: number) => rotations[i],
      rotationY: 0,
      duration: 1.4,
      stagger: 0.06,
      ease: "sine.inOut",
      paused: true,
      immediateRender: true,
      lazy: false,
    },
  );
}
