import React from "react";
import gintokiImg from "../assets/gintoki.png";

export default function QuoteImageSection() {
  return (
    <section style={styles.section}>
      <div style={styles.container}>
        {/* LEFT CONTENT */}
        <div style={styles.left}>
          <h3 style={styles.heading}>An honest truth of life!</h3>

          <p style={styles.quote}>
            Getting a job is like eating a bowl of ramen that someone sneezed
            in. Sure, it's disgusting, it smells weird, and there's definitely
            something wrong with the broth — but you're hungry, your landlord is
            at the door, and honestly? After the third slurp you stop caring.
            That's called growth. Or food poisoning. Either way, you're
            surviving, and that's more than most engineering graduates can say.
          </p>

          <p style={styles.attribution}>
            — Sakata Gintoki, probably, while picking his nose
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div style={styles.right}>
        <img src={gintokiImg} alt="gintoki" style={styles.image} />
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    width: "100%",
    padding: "24px",
    background: "#f6f6f6",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    background: "#fff",
    border: "4px solid #000",
    borderRadius: "28px",
    boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    minHeight: "520px",
  },
  left: {
    padding: "56px 48px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  heading: {
    fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
    fontWeight: 800,
    lineHeight: 1.2,
    marginBottom: "28px",
    color: "#000",
    letterSpacing: "-0.02em",
    fontFamily: "'DM Sans', 'Inter', sans-serif",
  },
  quote: {
    fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
    lineHeight: 1.8,
    color: "#222",
    marginBottom: "20px",
    fontFamily: "'Inter', sans-serif",
  },
  attribution: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#000",
    fontStyle: "italic",
    fontFamily: "'Inter', sans-serif",
  },
  right: {
    padding: "24px",
    borderLeft: "2px solid #111",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fafafa",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "20px",
    border: "3px solid #000",
  },
};
