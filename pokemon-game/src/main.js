import { PokemonDeck } from "./pokemonDeck";
import { Canvas } from "./canvas";

function createDeck() {
  const pokemonDeck = new PokemonDeck();
  const canvas = new Canvas(pokemonDeck);
}

createDeck();
