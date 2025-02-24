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

export default function FavoritesPage() {
  const [favoritePokemon, setFavoritePokemon] = useState<PokemonCard[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    async function fetchFavorites() {
      if (storedFavorites.length > 0) {
        const responses = await Promise.all(
          storedFavorites.map((id: string) =>
            fetch(`https://api.pokemontcg.io/v2/cards/${id}`).then((res) => res.json())
          )
        );
        setFavoritePokemon(responses.map((res) => res.data));
      }
    }

    fetchFavorites();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Favorite Pok&#39;emon ❤️</h1>

      {/* No favorites message */}
      {favoritePokemon.length === 0 && (
        <p className="text-center">You haven&apos;t favorited any Pok&#39;emon yet.</p>
      )}

      {/* Pokémon Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {favoritePokemon.map((card) => (
          <Link key={card.id} href={`/pokemon/${card.id}`}>
            <div className="bg-white p-4 shadow-md rounded-md cursor-pointer hover:shadow-lg transition-all transform hover:scale-105">
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
        ))}
      </div>

      {/* Back to Pokémon List Button */}
      <div className="text-center mt-6">
        <Link href="/pokemon" className="text-blue-600 hover:underline">
          ← Back to Pok&#39;emon List
        </Link>
      </div>
    </div>
  );
}
