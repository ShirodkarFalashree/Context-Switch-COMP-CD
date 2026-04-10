import "./App.css";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import heroVideo from "./assets/hero.mp4";

/* ─────────────────────────────────────
   DATA
───────────────────────────────────────*/
const products = [
  {
    id: 1,
    name: "Noir Essence",
    tagline: "Depth of Midnight",
    description:
      "A bold, woody fragrance that opens with smoky black pepper and settles into deep amber resin and sacred musk. Wear it for the nights you want to be remembered.",
    price: "$120",
    notes: ["Black Pepper", "Amber", "Musk", "Sandalwood"],
    mood: "Dark · Intense · Sensual",
    sizes: ["50ml", "100ml", "200ml"],
    accent: "#c9a96e",
    bg: "radial-gradient(ellipse 90% 70% at 28% 50%, #2a1a08 0%, #0b0b0f 68%)",
    image: "./assets/images/noir.jpeg",
  },
  {
    id: 2,
    name: "Velvet Bloom",
    tagline: "Soft Power",
    description:
      "An elegant floral heart wrapped in warm vanilla and white musk. Peony opens bright, rose deepens it, and vanilla leaves a trail that's impossible to ignore.",
    price: "$140",
    notes: ["Rose", "Peony", "Vanilla", "White Musk"],
    mood: "Romantic · Soft · Luxurious",
    sizes: ["50ml", "100ml", "200ml"],
    accent: "#e8a0b4",
    bg: "radial-gradient(ellipse 90% 70% at 28% 50%, #2d0d1f 0%, #100610 68%)",
    image: "./assets/images/velvet.jpeg",
  },
  {
    id: 3,
    name: "Azure Mist",
    tagline: "Fresh Horizon",
    description:
      "Crisp oceanic tones cut through with bright bergamot and a dry vetiver base. Clean, modern, effortless. The kind of scent that makes you feel like you're already somewhere better.",
    price: "$160",
    notes: ["Bergamot", "Sea Salt", "Vetiver", "Cedarwood"],
    mood: "Fresh · Clean · Modern",
    sizes: ["50ml", "100ml", "200ml"],
    accent: "#7ecfe4",
    bg: "radial-gradient(ellipse 90% 70% at 28% 50%, #0a2540 0%, #040e1a 68%)",
    image: "/images/azure.png",
  },
];

/* ─────────────────────────────────────
   MOTION CONFIG
───────────────────────────────────────*/
const SPRING        = { type: "spring", stiffness: 320, damping: 36, mass: 0.8 } as const;
const SPRING_SNAPPY = { type: "spring", stiffness: 430, damping: 38 } as const;
const EASE_OUT      = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────────────────
   TILT IMAGE
───────────────────────────────────────*/
function TiltImage({ src, accent }: { src: string; accent: string }) {
  const ref   = useRef<HTMLDivElement>(null);
  const rawX  = useMotionValue(0);
  const rawY  = useMotionValue(0);
  const rotX  = useSpring(useTransform(rawY, [-0.5, 0.5], [5, -5]), SPRING);
  const rotY  = useSpring(useTransform(rawX, [-0.5, 0.5], [-5, 5]), SPRING);
  const gloss = useSpring(useTransform(rawX, [-0.5, 0.5], [0, 1]), SPRING);
  const [imgError, setImgError] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { rawX.set(0); rawY.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        perspective: 800,
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {!imgError ? (
        <img
          src={src}
          alt="product"
          onError={() => setImgError(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div className="product-img-fallback">
          <div
            className="product-img-fallback-bottle"
            style={{
              background: `linear-gradient(135deg, ${accent}55, ${accent}15)`,
              border: `1px solid ${accent}40`,
              boxShadow: `0 0 40px ${accent}28`,
            }}
          />
          <span className="product-img-fallback-label">PRODUCT IMAGE</span>
        </div>
      )}

      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: useTransform(
            gloss,
            [0, 1],
            [
              "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0) 100%)",
              "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, transparent 55%)",
            ]
          ),
        }}
      />
      <div className="product-img-ring" />
    </motion.div>
  );
}

/* ─────────────────────────────────────
   APP
───────────────────────────────────────*/
export default function App() {
  const [index, setIndex]               = useState(0);
  const [dir,   setDir]                 = useState<1 | -1>(1);
  const [modal, setModal]               = useState<null | "open" | "done">(null);
  const [selectedSize, setSelectedSize] = useState("");

  const current = products[index];

  const go = useCallback(
    (d: 1 | -1) => {
      const next = index + d;
      if (next < 0 || next >= products.length) return;
      setDir(d);
      setIndex(next);
    },
    [index]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft")  go(-1);
      if (e.key === "Escape")     setModal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const openModal  = () => { setSelectedSize(""); setModal("open"); };
  const closeModal = () => setModal(null);
  const handleAdd  = () => {
    if (!selectedSize) return;
    setModal("done");
    setTimeout(() => setModal(null), 1600);
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 90 : -90, opacity: 0, scale: 0.965, filter: "blur(5px)" }),
    center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
    exit:  (d: number) => ({ x: d > 0 ? -90 : 90, opacity: 0, scale: 0.965, filter: "blur(5px)" }),
  };

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <motion.div
          className="navbar-inner glass"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, ...SPRING }}
        >
          <span className="navbar-logo">LUXE</span>
          <ul className="navbar-links">
            {["Story", "Fragrance", "Contact"].map((l) => (
              <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
            ))}
          </ul>
        </motion.div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <video className="hero-video" src={heroVideo} autoPlay loop muted playsInline />
        <div className="hero-vignette" />

        <div className="hero-content">
          <motion.p
            className="hero-eyebrow"
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ delay: 0.7, duration: 1.3 }}
          >
            A New Era of Scent
          </motion.p>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1.4, ease: EASE_OUT }}
          >
            Luxury<br /><em>Redefined</em>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1, ease: EASE_OUT }}
          >
            <motion.a
              href="#fragrance"
              className="hero-cta glass"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore the Collection
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          className="hero-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
        >
          <span className="hero-scroll-label">Scroll</span>
          <div className="hero-scroll-line" />
        </motion.div>
      </section>

      {/* ── STORY ── */}
      <section id="story" className="story">
        <div className="story-grid">
          <motion.div
            className="story-image-wrap"
            initial={{ opacity: 0, x: -48, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.3, ease: EASE_OUT }}
          >
            <img
              src="https://res.cloudinary.com/dghoya7tk/image/upload/v1775826662/Gemini_Generated_Image_ltzsldltzsldltzs_h4rfdk.png"
              alt="Our story"
            />
            <div className="story-image-ring" />
          </motion.div>

          <motion.div
            className="story-card glass"
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.3, ease: EASE_OUT, delay: 0.1 }}
          >
            <span className="story-eyebrow">Our Story</span>
            <h2 className="story-title">Crafted<br /><em>Identity</em></h2>
            <p className="story-body">
              Designed for those who command presence. Each fragrance captures
              emotion, depth, and individuality in every drop — a signature
              scent built not just to be worn, but to be remembered.
            </p>
            <div className="story-pillars">
              {[
                { n: "01", l: "Refined" },
                { n: "02", l: "Layered" },
                { n: "03", l: "Unique" },
              ].map(({ n, l }) => (
                <div key={n}>
                  <p className="pillar-num">{n}</p>
                  <p className="pillar-label">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PRODUCT ── */}
      <section
        id="fragrance"
        className="product-section"
        style={{ background: current.bg, transition: "background 1.1s ease" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + "_orb"}
            className="product-orb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{
              background: `radial-gradient(ellipse 48% 48% at 24% 50%, ${current.accent}14 0%, transparent 70%)`,
            }}
          />
        </AnimatePresence>
        <div className="product-grain" />

        {/* nav arrows */}
        <AnimatePresence>
          {index > 0 && (
            <motion.button
              className="nav-arrow nav-prev glass"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={SPRING}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => go(-1)}
              aria-label="Previous"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {index < products.length - 1 && (
            <motion.button
              className="nav-arrow nav-next glass"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={SPRING}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => go(1)}
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* progress dots */}
        <div className="product-dots">
          {products.map((_, i) => (
            <motion.button
              key={i}
              className={`product-dot ${i === index ? "active" : "inactive"}`}
              onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
              animate={{ width: i === index ? 28 : 6, opacity: i === index ? 0.75 : 0.28 }}
              transition={SPRING}
            />
          ))}
        </div>

        {/* keyboard hint */}
        <div className="keyboard-hint">
          {["←", "→"].map((k) => (
            <span key={k} className="key-cap glass">{k}</span>
          ))}
          <span className="key-label">navigate</span>
        </div>

        {/* product card */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current.id}
            className="product-card"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.58, ease: EASE_OUT }}
          >
            {/* Left — image */}
            <div className="product-image-panel">
              <TiltImage src={current.image} accent={current.accent} />
            </div>

            {/* Right — info */}
            <div className="product-info-panel">
              <div
                className="product-accent-line"
                style={{ background: `${current.accent}40` }}
              />

              <motion.span
                className="product-mood"
                style={{ color: current.accent }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, ...SPRING }}
              >
                {current.mood}
              </motion.span>

              <motion.h2
                className="product-name"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, ...SPRING }}
              >
                {current.name}
              </motion.h2>

              <motion.p
                className="product-tagline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.22 }}
              >
                {current.tagline}
              </motion.p>

              <motion.p
                className="product-desc"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.27, ...SPRING }}
              >
                {current.description}
              </motion.p>

              <motion.div
                className="product-notes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.32 }}
              >
                {current.notes.map((n, i) => (
                  <motion.span
                    key={n}
                    className="note-pill"
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.32 + i * 0.055, ...SPRING_SNAPPY }}
                    style={{
                      background: `${current.accent}17`,
                      border: `1px solid ${current.accent}34`,
                      color: current.accent,
                    }}
                  >
                    {n}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div
                className="product-cta-row"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, ...SPRING }}
              >
                <span className="product-price">{current.price}</span>
                <motion.button
                  className="btn-buy"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={openModal}
                  style={{
                    background: `linear-gradient(135deg, ${current.accent}28, ${current.accent}10)`,
                    border: `1px solid ${current.accent}52`,
                    color: current.accent,
                    boxShadow: `0 4px 22px ${current.accent}1a`,
                  }}
                >
                  Buy Now
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-sheet glass-heavy"
              initial={{ y: "100%", opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "55%", opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.52, ease: EASE_OUT }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="modal-glow"
                style={{ background: `${current.accent}0e` }}
              />

              <span className="modal-drag-handle" />

              <motion.button
                className="modal-close"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
              >
                ✕
              </motion.button>

              <span className="modal-label" style={{ color: current.accent }}>
                Add to Cart
              </span>
              <h3 className="modal-name">{current.name}</h3>
              <p className="modal-tagline">{current.tagline}</p>

              <p className="modal-size-label">Select Size</p>
              <div className="modal-sizes">
                {current.sizes.map((s) => {
                  const active = selectedSize === s;
                  return (
                    <motion.button
                      key={s}
                      className="size-btn"
                      whileTap={{ scale: 0.93 }}
                      onClick={() => setSelectedSize(s)}
                      style={
                        active
                          ? {
                              background: `${current.accent}22`,
                              border: `1px solid ${current.accent}60`,
                              color: current.accent,
                            }
                          : {
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.09)",
                              color: "rgba(255,255,255,0.45)",
                            }
                      }
                    >
                      {s}
                    </motion.button>
                  );
                })}
              </div>

              <div className="modal-price-row">
                <span className="modal-price">{current.price}</span>
                <AnimatePresence>
                  {!selectedSize && (
                    <motion.span
                      className="modal-size-hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      select a size
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                {modal === "done" ? (
                  <motion.div
                    key="done"
                    className="btn-add-success"
                    initial={{ opacity: 0, scale: 0.92, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={SPRING}
                    style={{
                      background: `${current.accent}1e`,
                      border: `1px solid ${current.accent}50`,
                      color: current.accent,
                    }}
                  >
                    ✓ Added to Cart
                  </motion.div>
                ) : (
                  <motion.button
                    key="add"
                    className="btn-add"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    whileHover={selectedSize ? { scale: 1.02, y: -1 } : {}}
                    whileTap={selectedSize ? { scale: 0.97 } : {}}
                    onClick={handleAdd}
                    disabled={!selectedSize}
                    transition={SPRING}
                    style={
                      selectedSize
                        ? {
                            background: `linear-gradient(135deg, ${current.accent}38, ${current.accent}18)`,
                            border: `1px solid ${current.accent}56`,
                            color: current.accent,
                            boxShadow: `0 6px 32px ${current.accent}22`,
                          }
                        : {
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            color: "rgba(255,255,255,0.18)",
                          }
                    }
                  >
                    Add to Cart
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FOOTER ── */}
      <footer id="contact" className="footer">
        <div className="footer-grid">
          <div>
            <p className="footer-brand-label">LUXE</p>
            <h2 className="footer-headline">
              Crafted for<br /><em>Memory</em>
            </h2>
            <p className="footer-tagline">Fragrances that leave a mark.</p>
          </div>

          <div className="footer-links-grid">
            {[
              { label: "Collection", links: ["Noir Essence", "Velvet Bloom", "Azure Mist"] },
              { label: "Company",    links: ["Our Story", "Craft", "Contact"] },
            ].map(({ label, links }) => (
              <div className="footer-col" key={label}>
                <p className="footer-col-label">{label}</p>
                <ul>
                  {links.map((l) => (
                    <li key={l}><a href="#">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="footer-copy">© 2026 LUXE — ALL RIGHTS RESERVED</p>
      </footer>
    </>
  );
}