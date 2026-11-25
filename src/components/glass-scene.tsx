"use client";
import { useId } from "react";
import { IRIS_CLOSED, RIBBON_WAVE } from "@/lib/motion/glass-geometry";
/** Code-native glass: translucent body, cobalt fold, white specular rim, and a thin caustic. */
export function GlassScene() {
  const prefix = useId().replace(/:/g, "");
  const id = (name: string) => `${prefix}-${name}`;
  const url = (name: string) => `url(#${id(name)})`;
  return (
    <>
      <svg
        className="intro-veil"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={id("sky")} cx="47%" cy="42%" r="80%">
            <stop stopColor="#F8FAFF" />
            <stop offset=".5" stopColor="#edf3ff" />
            <stop offset="1" stopColor="#DCEAFF" />
          </radialGradient>
          <mask
            id={id("opening")}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1600"
            height="900"
          >
            <rect width="1600" height="900" fill="white" />
            <path data-iris d={IRIS_CLOSED} fill="black" />
          </mask>
        </defs>
        <rect
          width="1600"
          height="900"
          fill={url("sky")}
          mask={url("opening")}
        />
      </svg>
      <div className="intro-atmosphere" data-intro-atmosphere />
      <svg
        className="intro-ribbon intro-ribbon-back"
        viewBox="0 0 1600 900"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={id("back")}
            x1="1300"
            y1="-40"
            x2="700"
            y2="650"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity=".1" />
            <stop offset=".38" stopColor="#adcaff" stopOpacity=".48" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".95" />
            <stop offset=".57" stopColor="#4e8efb" stopOpacity=".25" />
            <stop offset="1" stopColor="#fff" stopOpacity=".03" />
          </linearGradient>
        </defs>
        <g data-ribbon-back>
          <path
            d="M 1360 -260 C 900 80 1180 320 1690 190 L 1770 365 C 1000 540 860 10 1160 -270 Z"
            fill={url("back")}
            stroke="#fff"
            strokeOpacity=".8"
            strokeWidth="2"
          />
          <path
            d="M -240 880 C 200 510 510 960 1170 770 C 1350 715 1520 690 1760 720"
            stroke="#fff"
            strokeOpacity=".5"
            strokeWidth="3"
          />
        </g>
      </svg>
      <div className="intro-wing intro-wing-left" data-glass-left>
        <svg viewBox="0 0 800 1000" preserveAspectRatio="none">
          <defs>
            <linearGradient id={id("left")} x2="1" y2=".4">
              <stop stopColor="#d7e7ff" stopOpacity=".06" />
              <stop offset=".8" stopColor="#e8f2ff" stopOpacity=".36" />
              <stop offset="1" stopColor="#fff" stopOpacity=".7" />
            </linearGradient>
          </defs>
          <path
            d="M -200 -100 C 300 40 810 130 770 510 C 730 800 480 990 -200 1140 Z"
            fill={url("left")}
            stroke="white"
            strokeOpacity=".85"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="intro-wing intro-wing-right" data-glass-right>
        <svg viewBox="0 0 800 1000" preserveAspectRatio="none">
          <defs>
            <linearGradient id={id("right")} x1="1" x2="0" y2=".6">
              <stop stopColor="#91b9ff" stopOpacity=".08" />
              <stop offset=".8" stopColor="#dbeaff" stopOpacity=".32" />
              <stop offset="1" stopColor="#fff" stopOpacity=".8" />
            </linearGradient>
          </defs>
          <path
            d="M 1000 -100 C 330 -20 -130 330 80 610 C 260 850 630 950 1000 1110 Z"
            fill={url("right")}
            stroke="white"
            strokeOpacity=".9"
            strokeWidth="2"
          />
        </svg>
      </div>
      <svg
        className="intro-ribbon intro-ribbon-front"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={id("glass")}
            x1="460"
            y1="250"
            x2="700"
            y2="850"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#cce3ff" stopOpacity=".3" />
            <stop offset=".2" stopColor="#589bff" stopOpacity=".7" />
            <stop offset=".37" stopColor="#034fff" stopOpacity=".96" />
            <stop offset=".45" stopColor="#1262ee" stopOpacity=".75" />
            <stop offset=".52" stopColor="#eff9ff" stopOpacity=".94" />
            <stop offset=".61" stopColor="#81baff" stopOpacity=".2" />
            <stop offset=".76" stopColor="#e5f4ff" stopOpacity=".45" />
            <stop offset=".9" stopColor="#2864f0" stopOpacity=".45" />
            <stop offset="1" stopColor="#fff" stopOpacity=".8" />
          </linearGradient>
          <linearGradient id={id("edge")} x1="0" y1="0" x2="1" y2=".6">
            <stop stopColor="#074cf5" />
            <stop offset=".25" stopColor="#fff" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".6" />
            <stop offset=".72" stopColor="#77aeff" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
          <linearGradient id={id("sheen")} x1="0" x2="1">
            <stop stopColor="#fff" stopOpacity="0" />
            <stop offset=".48" stopColor="#fff" stopOpacity="0" />
            <stop offset=".55" stopColor="#fff" stopOpacity=".7" />
            <stop offset=".63" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g data-ribbon-front>
          <path
            data-ribbon-shape
            d={RIBBON_WAVE}
            fill={url("glass")}
            stroke={url("edge")}
            strokeWidth="2"
          />
          <path
            data-ribbon-shape
            d={RIBBON_WAVE}
            fill={url("sheen")}
            stroke="#fff"
            strokeWidth=".7"
            strokeOpacity=".65"
            transform="translate(0 -5)"
          />
        </g>
      </svg>
    </>
  );
}
