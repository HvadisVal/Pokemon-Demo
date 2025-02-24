"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// TypeScript interface for a Pokémon card
interface PokemonCard {
  id: string;
  name: string;
  images: {
    small: string;
  };
}

export default function PokemonList() {
  const [pokemon, setPokemon] = useState<PokemonCard[]>([]);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch Pokémon card data
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("https://api.pokemontcg.io/v2/cards?page=1&pageSize=20");
      const { data } = await res.json();
      setPokemon(data);
    }
    fetchData();

    // Load favorites from localStorage
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

  // Filter Pokémon based on search input
  const filteredPokemon = pokemon.filter((card) =>
    card.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Pokémon Trading Hub</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded-md mb-4"
      />

      {/* Pokémon Card Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredPokemon.length > 0 ? (
          filteredPokemon.map((card) => (
            <div key={card.id} className="bg-white p-4 shadow-md rounded-md relative">
              {/* Favorite Button ❤️ */}
              <button
                className="absolute top-2 right-2 text-2xl"
                onClick={() => toggleFavorite(card.id)}
              >
                {favorites.includes(card.id) ? "❤️" : "🤍"}
              </button>

              <Link href={`/pokemon/${card.id}`}>
                <div className="cursor-pointer hover:shadow-lg transition-all transform hover:scale-105">
                  <Image
                    src={card.images.small}
                    alt={card.name}
                    width={150}
                    height={210}
                    className="w-full h-auto"
                  />
                  <p className="mt-2 text-center font-semibold">{card.name}</p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center col-span-4">No Pokémon found...</p>
        )}
      </div>

      {/* Link to Favorites Page */}
      <div className="text-center mt-6">
        <Link href="/pokemon/favorites" className="text-blue-600 hover:underline">
          View Favorites →
        </Link>
      </div>
    </div>
  );
}
