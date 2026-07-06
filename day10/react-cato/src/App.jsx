import React, { useMemo, useState } from "react";
import "./App.css";

const items = [
  // 📱 MOBILES
  {
    type: "Mobile",
    name: "iPhone 15 Pro",
    brand: "Apple",
    price: 129999,
    image:
      "https://images.unsplash.com/photo-1695048133142-1c2c7a1b3f0b?w=800",
    specs: ["8GB RAM", "256GB", "48MP Camera", "A17 Pro Chip"],
  },
  {
    type: "Mobile",
    name: "Samsung S24 Ultra",
    brand: "Samsung",
    price: 119999,
    image:
      "https://images.unsplash.com/photo-1610792516307-0c0b0c0b0c0b?w=800",
    specs: ["12GB RAM", "512GB", "200MP Camera", "Snapdragon 8 Gen 3"],
  },
  {
    type: "Mobile",
    name: "Redmi Note 13 Pro",
    brand: "Redmi",
    price: 24999,
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
    specs: ["8GB RAM", "128GB", "200MP Camera", "5100mAh Battery"],
  },

  // 💻 LAPTOPS
  {
    type: "Laptop",
    name: "MacBook Pro M3",
    brand: "Apple",
    price: 189999,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    specs: ["16GB RAM", "512GB SSD", "M3 Chip", "Liquid Retina"],
  },
  {
    type: "Laptop",
    name: "Dell XPS 15",
    brand: "Dell",
    price: 149999,
    image:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800",
    specs: ["16GB RAM", "1TB SSD", "Intel i9", "4K Display"],
  },

  // 🎧 ACCESSORIES
  {
    type: "Accessory",
    name: "AirPods Pro 2",
    brand: "Apple",
    price: 24999,
    image:
      "https://images.unsplash.com/photo-1585386959984-a41552231693?w=800",
    specs: ["Noise Cancelling", "Spatial Audio", "MagSafe Case"],
  },
  {
    type: "Accessory",
    name: "Sony WH-1000XM5",
    brand: "Sony",
    price: 29999,
    image:
      "https://images.unsplash.com/photo-1518441902117-f0a8c7c1b1a2?w=800",
    specs: ["ANC Headphones", "30hr Battery", "Hi-Res Audio"],
  },
];

export default function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const text = search.toLowerCase();

    return items.filter((i) => {
      const matchCategory =
        category === "All" || i.type === category;

      const full =
        i.name.toLowerCase() +
        i.brand.toLowerCase() +
        i.type.toLowerCase() +
        i.specs.join(" ");

      const matchSearch = full.toLowerCase().includes(text);

      return matchCategory && matchSearch;
    });
  }, [search, category]);

  return (
    <div className="app">

      {/* HEADER */}
      <div className="hero">
        <h1>⚡ NEXORA HUB</h1>
        <p>Explore Mobiles • Laptops • Accessories in one place</p>
      </div>

      {/* SEARCH */}
      <input
        placeholder='Search anything: "Apple", "8GB RAM", "Laptop", "200MP"...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CATEGORY FILTER */}
      <div className="tabs">
        {["All", "Mobile", "Laptop", "Accessory"].map((t) => (
          <button
            key={t}
            className={category === t ? "active" : ""}
            onClick={() => setCategory(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid">
        {filtered.map((i, index) => (
          <div className="card" key={index}>

            <div className="type">{i.type}</div>

            <img src={i.image} alt={i.name} />

            <div className="content">
              <span className="brand">{i.brand}</span>
              <h2>{i.name}</h2>

              <div className="specs">
                {i.specs.map((s, idx) => (
                  <span key={idx}>{s}</span>
                ))}
              </div>

              <div className="price">₹{i.price.toLocaleString()}</div>

              <button>View Details</button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}