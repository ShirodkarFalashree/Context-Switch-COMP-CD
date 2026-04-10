// // app.tsx
// import React, { useEffect, useRef, useState } from "react";
// import "./app.css";
// import gsap from "gsap";
// import heroVideo from "./assets/hero.mp4";
// const products = [
//   {
//     id: 1,
//     name: "Noir Essence",
//     tagline: "Depth of Midnight",
//     description: "A bold woody fragrance with deep amber and musk",
//     price: "$120",
//     notes: ["Amber", "Musk", "Sandalwood"],
//     mood: "Dark · Intense · Sensual",
//     sizes: ["50ml", "100ml"],
//     color: "#0b0b0f"
//   },
//   {
//     id: 2,
//     name: "Velvet Bloom",
//     tagline: "Soft Power",
//     description: "Elegant floral heart wrapped in warm vanilla",
//     price: "$140",
//     notes: ["Rose", "Vanilla", "Peony"],
//     mood: "Romantic · Soft · Luxurious",
//     sizes: ["50ml", "100ml"],
//     color: "#3b0a1a"
//   },
//   {
//     id: 3,
//     name: "Azure Mist",
//     tagline: "Fresh Horizon",
//     description: "Crisp aquatic tones with citrus spark",
//     price: "$160",
//     notes: ["Citrus", "Oceanic", "Vetiver"],
//     mood: "Fresh · Clean · Modern",
//     sizes: ["50ml", "100ml"],
//     color: "#0a1f3b"
//   }
// ];

// export default function App() {
//   const [index, setIndex] = useState(0);
//   const [open, setOpen] = useState(false);
//   const currentRef = useRef<HTMLDivElement>(null);
//   const nextRef = useRef<HTMLDivElement>(null);
//   const modalRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     document.body.style.background = products[index].color;
//   }, [index]);

//   const changeProduct = (dir: "next" | "prev") => {
//     if (dir === "next" && index === products.length - 1) return;
//     if (dir === "prev" && index === 0) return;

//     const newIndex = dir === "next" ? index + 1 : index - 1;

//     if (!currentRef.current || !nextRef.current) return;

//     gsap.set(nextRef.current, {
//       x: dir === "next" ? "100%" : "-100%",
//       opacity: 0
//     });

//     gsap.to(currentRef.current, {
//       x: dir === "next" ? "-30%" : "30%",
//       opacity: 0,
//       scale: 0.92,
//       duration: 1,
//       ease: "power4.inOut"
//     });

//     setIndex(newIndex);

//     gsap.to(nextRef.current, {
//       x: "0%",
//       opacity: 1,
//       scale: 1,
//       duration: 1.2,
//       ease: "power4.out"
//     });
//   };

//   const openModal = () => {
//     setOpen(true);
//     setTimeout(() => {
//       if (modalRef.current) {
//         gsap.fromTo(modalRef.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 });
//       }
//     }, 10);
//   };

//   const closeModal = () => {
//     if (modalRef.current) {
//       gsap.to(modalRef.current, { scale: 0.85, opacity: 0, duration: 0.5 });
//       setTimeout(() => setOpen(false), 500);
//     }
//   };

//   return (
//     <div className="app">
//       <div className="navbar">
//         <div className="logo">LUXE</div>
//         <div className="nav-links">
//           <a href="#story">Story</a>
//           <a href="#product">Fragrance</a>
//           <a href="#footer">Contact</a>
//         </div>
//       </div>

//       <section className="hero">
//   <video
//     src={heroVideo}
//     autoPlay
//     loop
//     muted
//     playsInline
//     className="w-full h-full object-cover"
//   />
// </section>

//       <section className="story" id="story">
//         <div className="story-layout">
//           <div className="story-image">IMAGE</div>
//           <div className="story-content">
//             <h1>Crafted Identity</h1>
//             <h3>Luxury in Every Note</h3>
//             <p>
//               Designed for those who command presence, this fragrance captures emotion,
//               depth, and individuality in every drop. A signature scent built not just to
//               be worn, but remembered.
//             </p>
//           </div>
//         </div>
//       </section>

//       <section className="product" id="product">
//         <button className="arrow left" onClick={() => changeProduct("prev")}>‹</button>

//         <div className="product-stage">
//           <div className="product-card" ref={currentRef}>
//             <div className="image-placeholder">IMAGE</div>
//             <h2>{products[index].name}</h2>
//             <h4>{products[index].tagline}</h4>
//             <p>{products[index].description}</p>
//             <div className="notes">
//               {products[index].notes.map((n) => (
//                 <span key={n}>{n}</span>
//               ))}
//             </div>
//             <p className="mood">{products[index].mood}</p>
//             <span className="price">{products[index].price}</span>
//             <button className="buy" onClick={openModal}>Buy Now</button>
//           </div>

//           <div className="product-card ghost" ref={nextRef}></div>
//         </div>

//         <button className="arrow right" onClick={() => changeProduct("next")}>›</button>
//       </section>

//       {open && (
//         <div className="modal-overlay" onClick={closeModal}>
//           <div className="modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
//             <h2>{products[index].name}</h2>
//             <p>{products[index].price}</p>
//             <div className="sizes">
//               {products[index].sizes.map((s) => (
//                 <button key={s}>{s}</button>
//               ))}
//             </div>
//             <button className="checkout">Checkout</button>
//           </div>
//         </div>
//       )}

//       <footer className="footer" id="footer">
//         <div className="footer-inner">
//           <h3>LUXE</h3>
//           <p>Crafting identity through scent</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// import { useState } from "react";
// import "./app.css";
// import heroVideo from "./assets/hero.mp4";

// const products = [
//   {
//     name: "Aroma Noir",
//     price: "$120",
//     color: "#1a1a1a",
//     notes: ["Woody", "Amber", "Musk"],
//   },
//   {
//     name: "Velvet Rose",
//     price: "$140",
//     color: "#5c1a2f",
//     notes: ["Rose", "Vanilla", "Oud"],
//   },
//   {
//     name: "Citrus Aura",
//     price: "$100",
//     color: "#bfa300",
//     notes: ["Citrus", "Fresh", "Floral"],
//   },
// ];

// export default function App() {
//   const [index, setIndex] = useState(0);
//   const [showModal, setShowModal] = useState(false);

//   const next = () => {
//     setIndex((prev) => (prev + 1) % products.length);
//   };

//   const prev = () => {
//     setIndex((prev) =>
//       prev === 0 ? products.length - 1 : prev - 1
//     );
//   };

//   return (
//     <div className="app">

//       {/* NAVBAR */}
//       <div className="navbar">
//         <h3>LUXE</h3>
//         <div className="nav-links">
//           <a href="#story">Story</a>
//           <a href="#product">Fragrance</a>
//           <a href="#footer">Contact</a>
//         </div>
//       </div>

      
//       <section className="hero">
//         <video
//           src={heroVideo}
//           autoPlay
//           loop
//           muted
//           playsInline
//         />
        
//       </section>

//       {/* STORY */}
//      <section id="story" className="story">
//   <div className="story-container">
//     <div className="story-image-wrapper">
//       <img
//         src="https://images.unsplash.com/photo-1619994403073-2cec9c04fdb8?q=80&w=1200"
//         className="story-image"
//       />
//     </div>

//     <div className="story-content">
//       <span className="story-tag">OUR STORY</span>
//       <h2>Crafted Identity</h2>
//       <h3>Luxury in Every Note</h3>
//       <p>
//         Crafted with precision and passion, our fragrance reflects elegance,
//         mystery, and timeless identity. Each layer unfolds a story — from the
//         first impression to the lasting memory it leaves behind.
//       </p>

//       <div className="story-points">
//         <div>
//           <h4>01</h4>
//           <p>Refined ingredients sourced globally</p>
//         </div>
//         <div>
//           <h4>02</h4>
//           <p>Layered scent architecture for depth</p>
//         </div>
//         <div>
//           <h4>03</h4>
//           <p>Designed for presence and individuality</p>
//         </div>
//       </div>
//     </div>
//   </div>
// </section>

//       {/* PRODUCT */}
//       <section
//         id="product"
//         className="product"
//         style={{ background: products[index].color }}
//       >
//         <button className="arrow left" onClick={prev}>
//           ←
//         </button>

//         <div className="product-card">
//           <div className="image-placeholder">
//             IMAGE
//           </div>

//           <h2>{products[index].name}</h2>

//           <div className="notes">
//             {products[index].notes.map((note) => (
//               <span key={note}>{note}</span>
//             ))}
//           </div>

//           <span className="price">
//             {products[index].price}
//           </span>

//           <button
//             className="buy"
//             onClick={() => setShowModal(true)}
//           >
//             Buy Now
//           </button>
//         </div>

//         <button className="arrow right" onClick={next}>
//           →
//         </button>
//       </section>

//       {/* MODAL */}
//       {showModal && (
//         <div
//           className="modal-overlay"
//           onClick={() => setShowModal(false)}
//         >
//           <div className="modal">
//             <h2>Checkout</h2>
//             <p>Select Size:</p>
//             <div className="sizes">
//               <button>50ml</button>
//               <button>100ml</button>
//               <button>200ml</button>
//             </div>

//             <button className="checkout">
//               Proceed to Pay
//             </button>
//           </div>
//         </div>
//       )}

//       {/* FOOTER */}
//       <section id="footer" className="footer">
//         <div className="footer-inner">
//           <h2>LUXE</h2>
//           <p>Crafted with elegance © 2026</p>
//         </div>
//       </section>

//     </div>
//   );
// }

import { useState } from "react";
import heroVideo from "./assets/hero.mp4";

const products = [
  {
    name: "Aroma Noir",
    price: "$120",
    color: "#1a1a1a",
    notes: ["Woody", "Amber", "Musk"],
  },
  {
    name: "Velvet Rose",
    price: "$140",
    color: "#5c1a2f",
    notes: ["Rose", "Vanilla", "Oud"],
  },
  {
    name: "Citrus Aura",
    price: "$100",
    color: "#bfa300",
    notes: ["Citrus", "Fresh", "Floral"],
  },
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const next = () => setIndex((prev) => (prev + 1) % products.length);
  const prev = () =>
    setIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));

  return (
    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black text-white">

      {/* NAVBAR */}
     <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[55%]">

  <div className="
    flex items-center justify-between
    px-12 py-4 rounded-full

    backdrop-blur-2xl
    bg-gradient-to-r from-white/10 via-white/5 to-white/10
    border border-white/20

    shadow-[0_8px_40px_rgba(0,0,0,0.4)]
    relative overflow-hidden
  ">

    {/* subtle glow layer */}
    <div className="absolute inset-0 bg-white/5 blur-2xl opacity-30 pointer-events-none"></div>

    {/* logo */}
   <h3 className="text-sm tracking-[0.3em] font-medium text-white drop-shadow-md">
  LUXE
</h3>

<div className="flex gap-10 text-sm text-white/80">
  <a href="#story" className="hover:text-white transition">
    Story
  </a>
  <a href="#product" className="hover:text-white transition">
    Fragrance
  </a>
  <a href="#footer" className="hover:text-white transition">
    Contact
  </a>
</div>

  </div>
</div>
      {/* HERO */}
      <section className="relative h-screen w-full snap-start overflow-hidden">
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        {/* <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight">
            Luxury Redefined
          </h1>
        </div> */}
      </section>

      {/* STORY */}
      <section id="story" className="h-screen snap-start flex items-center justify-center px-10">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">

          <div className="rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1619994403073-2cec9c04fdb8?q=80&w=1200"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-10 rounded-3xl">
            <span className="text-xs tracking-widest opacity-60">OUR STORY</span>
            <h2 className="text-3xl mt-3">Crafted Identity</h2>
            <h3 className="text-xl opacity-70 mb-4">Luxury in Every Note</h3>

            <p className="opacity-80 leading-relaxed mb-6">
              Crafted with precision and passion, our fragrance reflects elegance,
              mystery, and timeless identity.
            </p>

            <div className="grid grid-cols-3 gap-4 text-sm">
              {["Refined", "Layered", "Unique"].map((item, i) => (
                <div key={i}>
                  <h4 className="text-lg font-semibold">0{i + 1}</h4>
                  <p className="opacity-70">{item}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* PRODUCT */}
      <section
        id="product"
        className="h-screen snap-start flex items-center justify-center relative transition-all duration-700"
        style={{ background: products[index].color }}
      >
        {/* ARROWS */}
        <button
          onClick={prev}
          className="absolute left-10 text-4xl opacity-70 hover:opacity-100"
        >
          ←
        </button>

        <button
          onClick={next}
          className="absolute right-10 text-4xl opacity-70 hover:opacity-100"
        >
          →
        </button>

        {/* CARD */}
        <div className="w-[400px] p-10 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">

          <div className="w-[260px] h-[260px] bg-black/30 mb-5 flex items-center justify-center">
            IMAGE
          </div>

          <h2 className="text-2xl mb-2">{products[index].name}</h2>

          <div className="flex gap-2 mb-3">
            {products[index].notes.map((note) => (
              <span
                key={note}
                className="px-3 py-1 rounded-full bg-white/20 text-xs"
              >
                {note}
              </span>
            ))}
          </div>

          <span className="text-xl">{products[index].price}</span>

          <button
            onClick={() => setShowModal(true)}
            className="mt-5 px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            Buy Now
          </button>
        </div>
      </section>

      {/* MODAL */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        >
          <div className="p-10 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20">
            <h2 className="text-2xl mb-4">Checkout</h2>

            <p className="mb-3">Select Size:</p>

            <div className="flex gap-3 mb-5">
              {["50ml", "100ml", "200ml"].map((size) => (
                <button
                  key={size}
                  className="px-4 py-2 rounded-full bg-white/20"
                >
                  {size}
                </button>
              ))}
            </div>

            <button className="px-6 py-3 bg-white text-black rounded-full">
              Proceed
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <section id="footer" className="h-[40vh] snap-start flex items-center justify-center">
        <div className="text-center backdrop-blur-xl bg-white/5 border border-white/10 px-12 py-8 rounded-3xl">
          <h2 className="text-2xl mb-2">LUXE</h2>
          <p className="opacity-70">Crafted with elegance © 2026</p>
        </div>
      </section>

    </div>
  );
}