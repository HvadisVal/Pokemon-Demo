import Image from "next/image";

// TypeScript interface for Pokémon details
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
  // Simulating loading for UI smoothness
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const res = await fetch(`https://api.pokemontcg.io/v2/cards/${params.id}`);
  const { data }: { data: PokemonDetails } = await res.json();

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">{data.name}</h1>

      {/* Pokémon Image */}
      <Image src={data.images.large} alt={data.name} width={300} height={420} className="w-full h-auto rounded-lg shadow-lg" />

      {/* Pokémon Info */}
      <p className="mt-4 text-lg"><strong>Supertype:</strong> {data.supertype}</p>
      <p className="text-lg"><strong>Subtypes:</strong> {data.subtypes.join(", ")}</p>
      <p className="text-lg"><strong>HP:</strong> {data.hp}</p>

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

      {/* Back to List Button */}
      <a href="/pokemon" className="mt-6 inline-block text-blue-600 hover:underline">← Back to Pokémon List</a>
    </div>
  );
}
