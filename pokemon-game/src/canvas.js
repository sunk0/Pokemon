import { Pokemon } from "./pokemon";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const MINIMUM_DISTANCE_TO_SPRITE_ORIGIN = 50;
const MOVE_SPRITE_CENTER_BY = 50;
const leftHpBarValues = {
  width: 300,
  height: 50,
  x: 1,
  y: 1
}

const rightHpBarValues = {
  width: 300,
  height: 50,
  x: 1220,
  y: 1
}

const battleResultsText = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  loserColor: 'crimson',
  winnerColor: 'springgreen',
  loserText: "You Lose! :(",
  winnerText: "You Win! :)"
}

const playAgainButton = {
  x: window.innerWidth / 2,
  y: battleResultsText.y + 40,
  textColor: 'orange',
  text: "Click here to play again"
}


addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

export class Canvas {
  isFightOn = false;
  pokemonTurn = false;
  randomIndex = 0;
  turn = false;
  isAttackAnnimationOn = false;
  pokemon = new Pokemon();
  defenderPokemon = new Pokemon();
  pokemonDeck;
  pokemonList = [];
  runningAnimation;
  playAgainButtonIsClickable = false;
  pokemonIsMoving = false;
  pokemonIsFighting = false;
  battleIntervalId;

  constructor(pokemonDeck) {

      this.pokemonDeck = pokemonDeck;
      pokemonDeck
        .fetchData()
        .then((list) => {
          this.pokemonList = list;
          this.drawPokemonList();
        })
        .catch((err) => console.log(err));
  
        canvas.addEventListener("mousedown", this.canvasClickHandler);     
   
  }

  selectPokemon = (event) => {
    if(!this.isFightOn) {
      let mouseX = event.clientX;
      let mouseY = event.clientY;
 
      this.pokemonList.forEach((pokemon, index) => {
        if (
          Math.abs(pokemon.dx + MOVE_SPRITE_CENTER_BY - mouseX) <
            MINIMUM_DISTANCE_TO_SPRITE_ORIGIN &&
          Math.abs(pokemon.dy + MOVE_SPRITE_CENTER_BY - mouseY) <
             MINIMUM_DISTANCE_TO_SPRITE_ORIGIN 
        ) {
          this.randomIndex = this.generateRandom(0, 19, pokemon);
          this.pokemonDeck.setLeftPokemon(pokemon);
          this.pokemonDeck.setRightPokemon(this.pokemonList[this.randomIndex])
 
          this.isFightOn = true;
          this.turn = this.pokemonDeck.leftPokemon.speed > this.pokemonDeck.rightPokemon.speed;
          this.battleIntervalId = setInterval(this.pokemonBattle, 250)
        }
      });
     }
  }

  playAgainClickHandler(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    if (this.playAgainButtonIsClickable && Math.abs(playAgainButton.x - mouseX) < 150 &&  Math.abs((playAgainButton.y - 13)- mouseY) <  16) {
      this.playAgainButtonIsClickable = false;
      this.isFightOn = false;
      this.drawPokemonList();
    }
  }

  canvasClickHandler = event => {
    this.selectPokemon(event);
    this.playAgainClickHandler(event);
  }

  pokemonBattle = () => {
    if (this.pokemonDeck.leftPokemon.hp < 0 || this.pokemonDeck.rightPokemon.hp < 0) {
      this.endBattle();
    } else 

    if (!this.pokemonIsMoving && !this.pokemonIsFighting) {
      this.pokemonIsMoving = true;
      this.animate(this.pokemonMove);
    } else if (this.pokemonIsFighting) {
      this.animate(this.pokemonAttack);
    }
  }

  endBattle = () => {
    clearInterval(this.battleIntervalId)
    this.drawResultText();
    this.drawPlayAgainButton();
  }

  drawPlayAgainButton = () => {
    const buttonText = playAgainButton.text
    this.playAgainButtonIsClickable = true;
    context.font = '24px Arial';
    context.fillStyle = playAgainButton.textColor;
    context.textAlign = "center";
    context.fillText(buttonText, playAgainButton.x, playAgainButton.y);
  }

  drawResultText = () => {
    const playerWins = this.pokemonDeck.rightPokemon.hp < 0;

    const fightResultText = playerWins ? battleResultsText.winnerText : battleResultsText.loserText;
    
    context.font = '48px Arial';
    context.fillStyle = playerWins ? battleResultsText.winnerColor : battleResultsText.loserColor;
    context.textAlign = "center";
    context.fillText(fightResultText, battleResultsText.x, battleResultsText.y);
  }


  pokemonAttack = () => {
    this.drawBattle();
    const attacker = this.turn ? this.pokemonDeck.leftPokemon : this.pokemonDeck.rightPokemon;
    const defender = this.turn ? this.pokemonDeck.rightPokemon : this.pokemonDeck.leftPokemon;
    const animationDone = attacker.attackPokemon(defender);
    this.drawBattle();

    if( animationDone ) {
      this.turn = !this.turn;
      attacker.resetPokemonPositionRelativeTo(defender);
      this.pokemonIsFighting = false;
      this.endAnimation()
      return true;
    }

    return false;
  }

  pokemonMove = () => {
    this.drawBattle();
    const attacker = this.turn ? this.pokemonDeck.leftPokemon : this.pokemonDeck.rightPokemon;
    const defender = this.turn ? this.pokemonDeck.rightPokemon : this.pokemonDeck.leftPokemon;
    const animationDone = attacker.movePokemonTo(defender);
   
    if( animationDone ) {
      this.pokemonIsMoving = false;
      this.pokemonIsFighting = true;
      this.endAnimation()
      return true;
    }

    return false;
  }

  drawPokemonList = () => {
 
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.pokemonList.forEach((pokemon) => {
      const image = new Image();
      image.onload = () => {
        context.drawImage(image, pokemon.dx, pokemon.dy, 100, 100);
      }
      image.src = pokemon.sprites["front_default"];
      const name = "Name: " + pokemon.name;
      const ability = "Ability: " + pokemon.ability[0].ability.name;
      const firstMoove = "Move 1: " + pokemon.moves[0].move.name;
      const secondMoove = "Move 2: " + pokemon.moves[1].move.name;
      const thirdMoove = "Move 3: " + pokemon.moves[2].move.name;
      const fourthMoove = "Move 4: " + pokemon.moves[3].move.name;
      const speed = "Speed: " + pokemon.speed;
      const specialDefence = "Special Defence: " + pokemon.specialDefence;
      const specialAttack = "Special Attack: " + pokemon.specialAttack;
      const defence = "Defence: " + pokemon.defence;
      const attack = "Attack: " + pokemon.attack;
      const hp = "HP: " + pokemon.hp;
      const statsArray = [
        name,
        ability,
        firstMoove,
        secondMoove,
        thirdMoove,
        fourthMoove,
        speed,
        specialDefence,
        specialAttack,
        defence,
        attack,
        hp,
      ];
      context.fillStyle = 'black';
      context.font = "12px arial";
      context.textAlign = 'left';
      statsArray.forEach((statTextItem, indx) => {
        context.fillText(
          statTextItem,
          pokemon.dx,
          pokemon.dy + 100 + indx * 15
        );
      });
    });
  };


  animate = drawingFunctionToAnimate => {
    this.runningAnimation = requestAnimationFrame(() => this.animate(drawingFunctionToAnimate));
    drawingFunctionToAnimate();
  };

  endAnimation = () => {
    cancelAnimationFrame(this.runningAnimation)
  }

  drawBattle = () => {
    const leftPokemon = this.pokemonDeck.leftPokemon;
    const rightPokemon = this.pokemonDeck.rightPokemon;

    const allyImage = new Image();
    const enemyImage = new Image();
    const backGround = new Image();

    backGround.src = "https://wallpapercave.com/wp/wp2711089.png";
    context.drawImage(backGround, 0, 0, 1600, 750);
    const lefthpBarPercentageOfOriginalHp = leftPokemon.hp / leftPokemon.originalHp;
    const righthpBarPercentageOfOriginalHp = rightPokemon.hp / rightPokemon.originalHp;
    const leftPokemonHealth = Math.max(1, Math.floor(lefthpBarPercentageOfOriginalHp * leftHpBarValues.width, 3));
    const rightPokemonHealth = Math.max(1, Math.floor(righthpBarPercentageOfOriginalHp * rightHpBarValues.width, 3));
    const rightOffset = (rightHpBarValues.width - righthpBarPercentageOfOriginalHp * rightHpBarValues.width)

    this.drawHpBar(leftHpBarValues.x, leftHpBarValues.y, leftPokemonHealth, leftHpBarValues.height, lefthpBarPercentageOfOriginalHp);
    this.drawHpBar(rightHpBarValues.x + rightOffset, rightHpBarValues.y, rightPokemonHealth , rightHpBarValues.height, righthpBarPercentageOfOriginalHp);
    this.drawName(leftPokemon.name, 1, 80);
    this.drawName(rightPokemon.name, 1350, 80);

    allyImage.src = leftPokemon.sprites["back_default"];
    context.drawImage(
      allyImage,
      leftPokemon.dx,
      leftPokemon.dy,
      300,
      300
    );

    enemyImage.src = rightPokemon.sprites["front_default"];
    context.drawImage(
      enemyImage,
      rightPokemon.dx,
      rightPokemon.dy,
      300,
      300
    );
  };

  generateRandom = (min, max , pokemon) => {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num === pokemon.id ? this.generateRandom(min, max) : num;
  };

  drawHpBar = (x, y, width, height, percentageHpOfOriginal) => {
    context.fillStyle = percentageHpOfOriginal > 0.5 ? "springgreen" : percentageHpOfOriginal > 0.1 ? "yellow" : "crimson";
    context.fillRect(x, y, width, height);
  };

  drawName = (name,x,y) => {
    context.fillStyle = "black";
    context.font = "30px Arial";
    context.fillText(name, x, y);
  };
}
