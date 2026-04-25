/**
 * ScrollingServices.jsx
 *
 * Reusable scroll-pinned marquee section inspired by the awwwards-portfolio repo.
 * Renders two rows of service tags that drift in opposite horizontal directions
 * as the user scrolls. Uses GSAP ScrollTrigger for the scroll-driven motion.
 *
 * Dependencies (install if missing):
 *   npm install gsap
 *
 * Usage:
 *   import ScrollingServices from './ScrollingServices';
 *
 *   // Minimal (uses built-in defaults)
 *   <ScrollingServices />
 *
 *   // Custom items & colours
 *   <ScrollingServices
 *     topRow={['React', 'Next.js', 'Node', 'GraphQL']}
 *     bottomRow={['Docker', 'AWS', 'CI/CD', 'Redis']}
 *     accentColor="#a855f7"
 *     label="Services"
 *   />
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── defaults ────────────────────────────────────────────────────────────────

const DEFAULT_TOP = [
  "Architecture",
  "Development",
  "Deployment",
  "APIs",
  "Frontends",
  "Scalability",
  "Databases",
];

const DEFAULT_BOTTOM = [
  "DevOps",
  "Cloud",
  "Performance",
  "Security",
  "Testing",
  "Microservices",
  "Automation",
];

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Duplicates an array enough times so the visual loop never runs out */
function repeat(arr, times = 3) {
  return Array.from({ length: times }, () => arr).flat();
}

// ─── sub-components ──────────────────────────────────────────────────────────

function ServiceTag({ text, index, accentColor }) {
  const isAccented = index % 4 === 0;
  return (
    <span
      className="service-tag"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        whiteSpace: "nowrap",
        fontFamily: "'Bebas Neue', 'Impact', 'Arial Narrow', sans-serif",
        fontSize: "clamp(2.8rem, 6vw, 7rem)",
        fontWeight: 400,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: isAccented ? accentColor : "currentColor",
        lineHeight: 1,
        padding: "0 1rem",
      }}
    >
      {text}
      {/* bullet separator */}
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: "0.5em",
          height: "0.5em",
          borderRadius: "50%",
          background: accentColor,
          opacity: 0.6,
          flexShrink: 0,
          marginLeft: "0.5rem",
        }}
      />
    </span>
  );
}

function TrackRow({ items, rowRef, direction = "left", accentColor }) {
  const repeated = repeat(items, 3);
  return (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        ref={rowRef}
        style={{
          display: "flex",
          alignItems: "center",
          willChange: "transform",
          /* start position set by GSAP */
        }}
      >
        {repeated.map((text, i) => (
          <ServiceTag
            key={`${text}-${i}`}
            text={text}
            index={i}
            accentColor={accentColor}
          />
        ))}
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function ScrollingServices({
  /** Items shown on the first (left-moving) row */
  topRow = DEFAULT_TOP,
  /** Items shown on the second (right-moving) row */
  bottomRow = DEFAULT_BOTTOM,
  /**
   * Accent colour used for every 4th tag and the bullet separators.
   * Defaults to a warm amber to complement a dark portfolio palette.
   */
  accentColor = "#0a0a0a",
  /**
   * Small eyebrow label above the section (set to null/empty to hide).
   */
  label = "Serves",
  /**
   * Background colour of the section.
   * Defaults to near-black so it stands out between other sections.
   */
  backgroundColor = "#f0f2f5",
  /** Text colour for the tags */
  textColor = "#0a0a0a",
  /**
   * How many viewport-heights the scroll animation is spread across.
   * Larger values = slower, more cinematic scroll.
   */
  scrollLength = 2,
  /**
   * How far (in %) each row travels from start to end of the scroll.
   * Negative value moves left; positive moves right.
   */
  travelPercent = 25,
}) {
  const sectionRef = useRef(null);
  const topRowRef = useRef(null);
  const bottomRowRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── label fade-in ────────────────────────────────────────────────────
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // ── horizontal marquee rows ──────────────────────────────────────────
      const commonScrollTrigger = {
        trigger: sectionRef.current,
        start: "top bottom",
        end: `+=${scrollLength * 100}%`,
        scrub: 1.2,       // silky smooth scrub
      };

      // Top row drifts LEFT
      gsap.fromTo(
        topRowRef.current,
        { xPercent: 0 },
        {
          xPercent: -travelPercent,
          ease: "none",
          scrollTrigger: commonScrollTrigger,
        }
      );

      // Bottom row drifts RIGHT
      gsap.fromTo(
        bottomRowRef.current,
        { xPercent: -travelPercent },
        {
          xPercent: 0,
          ease: "none",
          scrollTrigger: commonScrollTrigger,
        }
      );

      // ── individual tag scale-in on entry ────────────────────────────────
      gsap.fromTo(
        ".service-tag",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert(); // cleanup on unmount
  }, [scrollLength, travelPercent]);

  return (
    <section
      ref={sectionRef}
      aria-label="Services"
      style={{
        backgroundColor,
        color: textColor,
        padding: "8rem 0 10rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Subtle top border */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "5%",
          right: "5%",
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${accentColor}55, transparent)`,
        }}
      />

      {/* Eyebrow label */}
      {label && (
        <div
          ref={labelRef}
          style={{
            textAlign: "center",
            marginBottom: "4rem",
            opacity: 0, // animated in by GSAP
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', 'Courier New', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: accentColor,
              border: `1px solid ${accentColor}55`,
              padding: "0.4rem 1.2rem",
              borderRadius: "999px",
            }}
          >
            {label}
          </span>
        </div>
      )}

      {/* Row 1 — drifts left on scroll */}
      <div style={{ marginBottom: "1.5rem" }}>
        <TrackRow
          items={topRow}
          rowRef={topRowRef}
          direction="left"
          accentColor={accentColor}
        />
      </div>

      {/* Row 2 — drifts right on scroll */}
      <TrackRow
        items={bottomRow}
        rowRef={bottomRowRef}
        direction="right"
        accentColor={accentColor}
      />

      {/* Subtle bottom border */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: "5%",
          right: "5%",
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${accentColor}55, transparent)`,
        }}
      />
    </section>
  );
}