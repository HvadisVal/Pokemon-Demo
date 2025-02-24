import Image from "next/image";
import Link from "next/link";

interface PokemonDetails {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  images: {
    large: string;
  };
  hp: string;
  attacks?: { name: string; damage: string; text: string }[];
}

export default async function PokemonDetailPage({ params }: { params: { id: string } }) {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
  const res = await fetch(`https://api.pokemontcg.io/v2/cards/${params.id}`);
  const { data }: { data: PokemonDetails } = await res.json();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="w-full flex justify-between mb-4">
        <Link href="/pokemon" className="text-blue-600 hover:underline">← Back to Pokémon List</Link>
        <Link href="/pokemon/favorites" className="text-blue-600 hover:underline">❤️ View Favorites</Link>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Left Side - Pokémon Image */}
        <div className="w-full md:w-1/3 flex justify-center">
          <Image src={data.images.large} alt={data.name} width={250} height={350} className="rounded-lg shadow-lg" />
        </div>

        {/* Right Side - Pokémon Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{data.name}</h1>
          <p><strong>Supertype:</strong> {data.supertype}</p>
          <p><strong>Subtypes:</strong> {data.subtypes.join(", ")}</p>
          <p><strong>HP:</strong> {data.hp}</p>

          {/* Attacks */}
          {data.attacks && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold">Attacks</h2>
              {data.attacks.map((attack) => (
                <div key={attack.name} className="p-2 border rounded-md mt-2 shadow-sm">
                  <p className="font-bold">{attack.name} - {attack.damage} damage</p>
                  <p className="text-sm">{attack.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
