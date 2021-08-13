//let suit = ["♣", "♦", "♥","♠"]
let suit = ["clubs", "diamonds", "hearts", "spades"]
let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

class Card {
    constructor(suit, value, points) {
        this.suit = suit;
        this.value = value;
        this.points = points;
    }

    isAce() {
        return this.value === "A";
    }

    color() {
        return this.suit == "clubs" || this.suit == "spades" ? "black" : "red";
    }
}

class Deck {

    constructor(cards) {
        this.cards = cards;
    }

    shuffle() {
        
    }
}

const createDeck = () => {
    let cards = [];

    cards = suit.flatMap(suit => {
        return values.map(value => {
            return new Card(suit, value, []);
        })
    });

    // TODO: I may be able to remove this logic because I can change the
    // way that my game works to not have to do it this way.
    cards.map(card => {
        if(card.value === "J" || card.value === "Q" || card.value === "K") {
            card.points.push(10);
        } else if(card.value === "A") {
            card.points.push(1, 11);
        } else {
            card.points.push(parseInt(card.value));
        }
    });
    return new Deck(cards);
}

let deck = createDeck();
console.log(deck.cards[12]);
console.log(deck.cards[12].isAce());

class Player {

    // We want to give the player a name, the current cards in their hand,
    // and what is their turn which I may give them based on their current
    // position in the players' array (if I add multiple players)
    constructor(name, hand, cash, isDealer) {
        this.name = name;
        this.hand = hand;
        this.cash = cash;
        this.isDealer = isDealer;
    }

    isDealer() {
        return this.isDealer;
    }

    handTotal() {
        // Two different totals. 
        let total = 0;
        
        // TODO: Get the value of all the cards except for aces
        //       Determine the value of the player's hand. If that value
        //       + the value of the amount of Aces (e.g., if there are
        //       2 aces: 11 + 1 or 1 + 1 if the first condition would give
        //       the player more than 21)

        // Solutions: Use an array to remove all aces and calculate those 
        // values

        let aces = this.amountOfAces();
        if(aces > 0) {
            if((total + 11) > 21) {
                total + aces;
            } else {
                total += 11;
                total += aces - 1; //This accomdates for the value of Aces
            }
        }
        return total; 
    }

    amountOfAces() {
        return this.hand.reduce((total, card) => {
            if(card.value === "A") {
                total += 1;
            }
        });
    }

    hasAces() {
        return this.amountOfAces() > 0;
    }

    isBusted() {
        return this.handTotal() >= 21;
    }

    addCards(cards) {
        return this.hand.push(cards);
    }

    
}

class Dealer extends Player {
    constructor(name, hand, isDealer) {
        super(name, hand, isDealer);
    }

    dealCardsToPlayer(player, cards) {
        if(cards.length === 0 || cards.length < 2) {
            return [];
        }
        // Should give the last two cards in the deck
        return [cards[cards.length - 1], cards[cards.length - 2]]
    }
}

let players = [];
let losers = [];
let currentTurn = 1;

let dealer = new Dealer("Dealer", [], true);

// The dealer will be played by the computer through methods of giving out
// cards and things like that
// and things 

let getLosers = () => {
    return losers;
}

let whosTurnIsIt = () => {
    // A way of seeing who is currently going
    return  players[currentTurn - 1];
}

let changeTurns = () => {
    // This is pretty much saying, if the current turn is greater than the number of players left,
    // it should go back to 1. Otherwise, it should increase by one
    // FIXME: Check to see if any issues arrise when a player is removed out of the array if they "bust".
    //        Ideally, it should just move to the next player who is still in the array because they have not "busted" yet.
    return currentTurn >= players.length ? currentTurn = 1 : currentTurn++;
}

let checkToSeeIfBusted = (player) => {
    if(player.isBusted()) {
        // Adds player to losers (those who have busted)
        losers.push(player);
        // Removes player from current players
        players.shift(players.indexOf(player), 1);
    } 
}

let round = () => {
    // Check for any winning conditions before continuing game

    // Allow dealer to put up new cards
        // Face down card
        // Face up card

    // Players can select cards

    // If player bust, remove them from the array and continue 
    // with players that are alive. I could add the "losers" to a
    // losers' array


    // WINNING CONDITIONS

    // If the dealer bust, all of the players left should win
    // 
    if(!dealer.isBusted()) {
        // Checks to make sure that a least one player is still in the game
        if(players.length > 0) {
            
        } else {
            // If all players have busted then the game should end
            // This also means that the dealer has "won"
            endGame();
        }
    } else {
        // Game should now end and we will check to see who was still 
        // left
        endGame();
    }
}

let turn = (player) => {
    if(!dealer.isBusted()) {
        // FIXME: Move this to the right location. Should be called when 
        // dealer is going to give out cards to player
        let twoCards = dealer.dealCardsToPlayer(player, null);
        // Checks to make sure that a least one player is still in the game
        // FIXME: Need to check to see if the current player is a dealer
        if(!player.isBusted() && !player.isDealer()) {
            player.addCards(twoCards);
            checkToSeeIfBusted(player);
            changeTurns();
        }
    } else {
        // Game should now end and we will check to see who was still 
        // left
        endGame();
    }
}