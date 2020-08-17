import axios from "axios";
import { Pokemon } from "./pokemon";

const LEFT_POKEMON_DEFAULT_POSITION = { dx: 0, dy: 200 };
const RIGHT_POKEMON_DEFAULT_POSITION = { dx: 1250, dy: 200 };

export class PokemonDeck {
  fetchedData = [];
  pokemonDeck = [];
  apiUrl = "https://pokeapi.co/api/v2/pokemon/";
  leftPokemon;
  rightPokemon;
  constructor() {
  }

   fetchData = async () => {
    try {
      const pokemonsResponse = await axios.get(this.apiUrl);
      const pokemons = pokemonsResponse.data.results;
      
      this.fetchedData = (await Promise.all(
        pokemons.map((pokemon) => {
          const pokemonResponse = axios.get(pokemon.url);
          return pokemonResponse;
        })
      )).map(pokemonRes => pokemonRes.data);


      this.fetchedData.forEach((pokemon, index) => {
        this.pokemonDeck.push(
          new Pokemon(
            index,
            {
              back_default: pokemon.sprites["back_default"],
              front_default: pokemon.sprites["front_default"],
            },
            pokemon.name,
            pokemon.abilities
              .filter((ability) => ability.is_hidden === false)
              .slice(0, 1),
            pokemon.moves.slice(0, 4),
            pokemon.stats[5].base_stat,
            pokemon.stats[4].base_stat,
            pokemon.stats[3].base_stat,
            pokemon.stats[2].base_stat,
            pokemon.stats[1].base_stat,
            pokemon.stats[0].base_stat,
            30 + 140 * (index >= 10 ? index - 10 : index),
            index >= 10 ? 350 : 50
          )
        );
      });
      return Promise.resolve(this.pokemonDeck);
    } catch {
      return Promise.reject("Something went wrong");
    }
  }


  setLeftPokemon = (pokemon) => {
    this.leftPokemon = pokemon;
    this.leftPokemon = Object.create(pokemon);
    this.leftPokemon.dx = LEFT_POKEMON_DEFAULT_POSITION.dx;
    this.leftPokemon.dy = LEFT_POKEMON_DEFAULT_POSITION.dy;
  }

  setRightPokemon = (pokemon) => {
    this.rightPokemon = Object.create(pokemon);
    this.rightPokemon.dx = RIGHT_POKEMON_DEFAULT_POSITION.dx;
    this.rightPokemon.dy = RIGHT_POKEMON_DEFAULT_POSITION.dy;
  }

  resetLeftPokemonPosition = () => {
    this.leftPokemon.dx = LEFT_POKEMON_DEFAULT_POSITION.dx;
    this.leftPokemon.dy = LEFT_POKEMON_DEFAULT_POSITION.dy;
  }

  resetRightPokemonPosition = () => {
    this.rightPokemon.dx = RIGHT_POKEMON_DEFAULT_POSITION.dx;
    this.rightPokemon.dy = RIGHT_POKEMON_DEFAULT_POSITION.dy;
  }

  getPokemons = () => {
    return this.pokemonDeck;
  }
}
