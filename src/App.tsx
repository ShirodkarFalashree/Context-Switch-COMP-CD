// app.tsx
import React, { useEffect, useRef, useState } from "react";
import "./app.css";
import gsap from "gsap";

const products = [
  {
    id: 1,
    name: "Noir Essence",
    tagline: "Depth of Midnight",
    description: "A bold woody fragrance with deep amber and musk",
    price: "$120",
    notes: ["Amber", "Musk", "Sandalwood"],
    mood: "Dark · Intense · Sensual",
    sizes: ["50ml", "100ml"],
    color: "#0b0b0f"
  },
  {
    id: 2,
    name: "Velvet Bloom",
    tagline: "Soft Power",
    description: "Elegant floral heart wrapped in warm vanilla",
    price: "$140",
    notes: ["Rose", "Vanilla", "Peony"],
    mood: "Romantic · Soft · Luxurious",
    sizes: ["50ml", "100ml"],
    color: "#3b0a1a"
  },
  {
    id: 3,
    name: "Azure Mist",
    tagline: "Fresh Horizon",
    description: "Crisp aquatic tones with citrus spark",
    price: "$160",
    notes: ["Citrus", "Oceanic", "Vetiver"],
    mood: "Fresh · Clean · Modern",
    sizes: ["50ml", "100ml"],
    color: "#0a1f3b"
  }
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.background = products[index].color;
  }, [index]);

  const changeProduct = (dir: "next" | "prev") => {
    if (!productRef.current) return;
    if (dir === "next" && index === products.length - 1) return;
    if (dir === "prev" && index === 0) return;

    const xOut = dir === "next" ? "-120%" : "120%";
    const xIn = dir === "next" ? "120%" : "-120%";

    gsap.to(productRef.current, { x: xOut, duration: 0.6, ease: "power3.inOut" });

    setTimeout(() => {
      setIndex((i) => (dir === "next" ? i + 1 : i - 1));
      gsap.fromTo(productRef.current, { x: xIn }, { x: "0%", duration: 0.6, ease: "power3.inOut" });
    }, 600);
  };

  const openModal = () => {
    setOpen(true);
    setTimeout(() => {
      if (modalRef.current) {
        gsap.fromTo(modalRef.current, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 });
      }
    }, 10);
  };

  const closeModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, { scale: 0.7, opacity: 0, duration: 0.3 });
      setTimeout(() => setOpen(false), 300);
    }
  };

  return (
    <div className="app">
      <div className="navbar">
        <div className="logo">LUXE</div>
        <div className="nav-links">
          <a href="#story">Story</a>
          <a href="#product">Fragrance</a>
          <a href="#footer">Contact</a>
        </div>
      </div>

      <section className="hero">
        <div className="video-placeholder">VIDEO PLACEHOLDER</div>
      </section>

      <section className="story" id="story">
        <h1>Crafted Identity</h1>
        <p>Inspired by emotion, built for presence and memory</p>
      </section>

      <section className="product" id="product">
        <button className="arrow left" onClick={() => changeProduct("prev")}>‹</button>

        <div className="product-content" ref={productRef}>
          <div className="image-placeholder">IMAGE</div>
          <h2>{products[index].name}</h2>
          <h4>{products[index].tagline}</h4>
          <p>{products[index].description}</p>
          <div className="notes">
            {products[index].notes.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
          <p className="mood">{products[index].mood}</p>
          <span className="price">{products[index].price}</span>
          <button className="buy" onClick={openModal}>Buy Now</button>
        </div>

        <button className="arrow right" onClick={() => changeProduct("next")}>›</button>
      </section>

      {open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <h2>{products[index].name}</h2>
            <p>{products[index].price}</p>
            <div className="sizes">
              {products[index].sizes.map((s) => (
                <button key={s}>{s}</button>
              ))}
            </div>
            <button className="checkout">Checkout</button>
          </div>
        </div>
      )}

      <footer className="footer" id="footer">
        <p>© 2026 Luxe Perfumes</p>
      </footer>
    </div>
  );
}