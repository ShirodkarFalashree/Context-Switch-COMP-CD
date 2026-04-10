// app.tsx
import React, { useEffect, useRef, useState } from "react";
import "./app.css";
import gsap from "gsap";

const products = [
  { id: 1, name: "Noir Essence", color: "#0b0b0f", price: "$120", desc: "Dark woody scent" },
  { id: 2, name: "Velvet Bloom", color: "#3b0a1a", price: "$140", desc: "Floral luxury blend" },
  { id: 3, name: "Azure Mist", color: "#0a1f3b", price: "$160", desc: "Fresh aquatic notes" }
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.background = products[index].color;
  }, [index]);

  const animate = (dir: "next" | "prev") => {
    if (!productRef.current) return;
    const out = dir === "next" ? "-100%" : "100%";
    const from = dir === "next" ? "100%" : "-100%";
    gsap.to(productRef.current, { x: out, duration: 0.5, ease: "power2.inOut" });
    setTimeout(() => {
      setIndex((i) => (dir === "next" ? i + 1 : i - 1));
      gsap.fromTo(productRef.current, { x: from }, { x: "0%", duration: 0.5, ease: "power2.inOut" });
    }, 500);
  };

  const openModal = () => {
    setOpen(true);
    setTimeout(() => {
      if (modalRef.current) {
        gsap.fromTo(modalRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 });
      }
    }, 10);
  };

  const closeModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, { scale: 0.8, opacity: 0, duration: 0.3 });
      setTimeout(() => setOpen(false), 300);
    }
  };

  return (
    <div className="app">
      <div className="navbar">LUXE</div>

      <section className="hero">
        <div className="video-placeholder">VIDEO</div>
      </section>

      <section className="story">
        <h1>Crafted Identity</h1>
        <p>Luxury fragrance storytelling placeholder</p>
      </section>

      <section className="product">
        <button disabled={index === 0} className="arrow left" onClick={() => animate("prev")}>‹</button>

        <div className="product-content" ref={productRef}>
          <div className="image-placeholder">IMAGE</div>
          <h2>{products[index].name}</h2>
          <p>{products[index].desc}</p>
          <span>{products[index].price}</span>
          <button className="buy" onClick={openModal}>Buy Now</button>
        </div>

        <button disabled={index === products.length - 1} className="arrow right" onClick={() => animate("next")}>›</button>
      </section>

      {open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <h2>{products[index].name}</h2>
            <p>{products[index].price}</p>
            <div className="options">
              <button>50ml</button>
              <button>100ml</button>
            </div>
            <button className="checkout">Checkout</button>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>© 2026 Luxe Perfumes</p>
      </footer>
    </div>
  );
}