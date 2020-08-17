const LEFT_POKEMON_DEFAULT_POSITION = { dx: 0, dy: 200 };
const RIGHT_POKEMON_DEFAULT_POSITION = { dx: 1250, dy: 200 };

export class Pokemon {
  id;
  sprites;
  name;
  ability;
  moves;
  speed;
  specialDefence;
  specialAttack;
  defence;
  attack;
  hp;
  originalHp;
  dx;
  dy;
  blinkCounter = 0;

  constructor(
    id,
    sprites,
    name,
    ability,
    moves,
    speed,
    specialDefence,
    specialAttack,
    defence,
    attack,
    hp,
    dx,
    dy
  ) {
    this.sprites = sprites;
    this.name = name;
    this.ability = ability;
    this.moves = moves;
    this.speed = speed;
    this.specialDefence = specialDefence;
    this.specialAttack = specialAttack;
    this.defence = defence;
    this.attack = attack;
    this.hp = hp;
    this.originalHp = hp;
    this.dx = dx;
    this.dy = dy;
    this.id = id;
  }

  movePokemonTo(pokemon) {
    if (Math.abs(this.dx - pokemon.dx) < 300) {
      return true
    } else {
      this.dx = this.dx < pokemon.dx ? this.dx + 10 : this.dx - 10 ;
      return false;
    }
  }

  attackPokemon = (pokemon) => {

      //This is that way to make the battle longer!!!
      pokemon.hp = Math.round(pokemon.hp - (this.attack / pokemon.defence) *(1 + Math.floor(Math.random()*8)), 3);


      //TODO MAKE BLIKNING ANIMATION
      console.log(pokemon.hp);
      
      //REFACTOR
      if(pokemon.hp <= 0){
        return true;
      }
      else{
        return true;
      }
     

  }

  resetPokemonPositionRelativeTo(pokemon) {
      this.dx = this.dx < pokemon.dx ? LEFT_POKEMON_DEFAULT_POSITION.dx : RIGHT_POKEMON_DEFAULT_POSITION.dx;
  }

  setDx(dx) {
    this.dx = dx;
  }
  setDy(dy) {
    this.dy = dy;
  }

  getDx() {
    return this.dx;
  }

  getDy() {
    return this.dy;
  }
}
