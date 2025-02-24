"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// TypeScript interface for a Pokémon card
interface PokemonCard {
  id: string;
  name: string;
  hp?: string;
  rarity?: string;
  types?: string[];
  images: {
    small: string;
  };
}

export default function PokemonList() {
  const [pokemon, setPokemon] = useState<PokemonCard[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterType, setFilterType] = useState(""); // Pokémon Type Filter
  const [sortOption, setSortOption] = useState("name"); // Sorting Option

  // Fetch Pokémon card data
  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=20`);
      const { data } = await res.json();
      setPokemon((prev) => [...prev, ...data]); // Append new Pokémon to the list
    }
    fetchData();
  }, [page]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFavorites);
  }, []);

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    let updatedFavorites = [...favorites];

    if (updatedFavorites.includes(id)) {
      updatedFavorites = updatedFavorites.filter((fav) => fav !== id);
    } else {
      updatedFavorites.push(id);
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Filter Pokémon by Type
  const filteredPokemon = pokemon.filter((card) =>
    card.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterType === "" || (card.types && card.types.includes(filterType)))
  );

  // Sort Pokémon based on selected option
  filteredPokemon.sort((a, b) => {
    if (sortOption === "hp") return (parseInt(b.hp || "0") - parseInt(a.hp || "0"));
    if (sortOption === "rarity") return (a.rarity || "").localeCompare(b.rarity || "");
    return a.name.localeCompare(b.name); // Default sorting: Name
  });

  return (
    <div className="p-6">
      {/* Top Navigation */}
      <div className="flex justify-between mb-4">
        <Link href="/pokemon/favorites" className="text-blue-600 hover:underline">
          ❤️ View Favorites
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Pokémon Trading Hub</h1>

      {/* Search, Filter & Sort Options */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <select className="p-2 border rounded-md" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Fire">Fire</option>
          <option value="Water">Water</option>
          <option value="Grass">Grass</option>
        </select>
        <select className="p-2 border rounded-md" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="hp">Sort by HP</option>
          <option value="rarity">Sort by Rarity</option>
        </select>
      </div>

      {/* Pokémon Card Grid (Now 3 per row) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredPokemon.map((card, index) => (
          <div key={`${card.id}-${index}`} className="bg-white p-4 shadow-md rounded-md relative">
            {/* Favorite Button ❤️ */}
            <button
              className="absolute top-2 right-2 text-2xl z-10"
              onClick={() => toggleFavorite(card.id)}
            >
              {favorites.includes(card.id) ? "❤️" : "🤍"}
            </button>

            <Link href={`/pokemon/${card.id}`}>
              <div className="cursor-pointer hover:shadow-lg transition-all transform hover:scale-105">
                <Image
                  src={card.images.small}
                  alt={card.name}
                  width={120} // Smaller image
                  height={180}
                  className="w-full h-auto"
                />
                <p className="mt-2 text-center font-semibold">{card.name}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-6">
        <button
          onClick={() => setPage(page + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Load More Pokémon
        </button>
      </div>
    </div>
  );
}
