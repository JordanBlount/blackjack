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

    // Removes specific card from array
    removeCard(card) {
        this.cards.slice(this.cards.indexOf(card), 1);
    }

    // This removes the card from the top of the deck
    // It return the card that was removed
    pickCardFromTop() {
        return this.cards.shift();
    }
}

const createDeck = () => {
    let cards = [];

    cards = suit.flatMap(suit => {
        return values.map(value => {
            return new Card(suit, value, []);
        })
    });

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
    constructor(name, hand, cash, bet, isDealer) {
        this.name = name;
        this.hand = hand;
        this.cash = cash;
        this.bet = bet;
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
                console.log(card);
                total += 1;
            }
            return total;
        }, 0); // Has to have an initial value
    }

    hasAces() {
        return this.amountOfAces() > 0;
    }

    isBusted() {
        return this.handTotal() >= 21;
    }

    isBroke() {
        return this.cash <= 0;
    }

    addCards(cards) {
        return this.hand.push(cards);
    }
    
    setBet(bet) {
        this.bet = bet;
    }

    currentBet() {
        return this.bet;
    }

    addCash(amount) {
        this.cash += amount;
    }

    removeCash(amount) {
        this.cash -= amount;
    }

    get cashAmt() {
        return this.cash;
    }
}

class Dealer extends Player {
    constructor(name, hand, cash, bet, isDealer) {
        super(name, hand, cash, bet, isDealer);
    }

    dealTwoCards(cards, player) {
        player.addCards([deck.pickCardFromTop(), deck.pickCardFromTop()]); 
    }

    dealCard(deck, player) {
        player.addCards(deck.pickCardFromTop());
    }
}

let player1 = null;
let dealer = null;
let currentTurn = 1;

// FIXME: This may not be used
let whosTurnIsIt = () => {
    // A way of seeing who is currently going
    return  currentTurn == 1 ? player1 : dealer;
}

let changeTurns = () => {
    if(currentTurn === 1) {
         currentTurn = 2; 
    } else {
        currentTurn = 1;
    }
}

player1 = new Player("Jordan", [], 100, 0, false);
dealer = new Dealer("House", [], 100, 0, true);

let giveAcesTest = () => {
    deck.cards.map(card => {
        if(card.isAce()) {
            player1.addCards(card);
        }
    });
}

console.log(whosTurnIsIt());

giveAcesTest();
console.log(player1.hand);
console.log("Checking to see how many Aces");
console.log(player1.amountOfAces());

let resetForNewRound = () => {
    deck = createDeck();
    currentTurn = 1;

    // Remove any winning notifications or things like that
}

let totalReset = () => {
    player = null;
    dealer = null;
    deck = null;
    currentTurn = 1;
    // Open intro screen
}

let hit = () => {
    let player = whosTurnIsIt();
}

let hold = () => {
    let player = whosTurnIsIt();
}

let checkForWinner = () => {
    if(!player.isBroke()) {
        // This is the logic for checking if someone has won the current
        // round
        if(player.isBusted() && !dealer.isBusted()) {
            // Dealer wins
            // Send "You lose message"
            // Update module or buttons (to be able to prompt for next round)
        } else if(dealer.isBusted() && !player.isBusted()) {
            // Player wins
            // Send "You lose message"
            // Update module or buttons (to be able to prompt for next round)
        } else {
            // This should never ever happen.
        }
    } else {
        // All of the player's money is gone. Game totally over
        // You won the game! Congradulations!
        // Update game buttons to start new game (e.g, "Play again?")
    }
}

// Screen that shows the rules of the game
let showInstructions = (show) => {
    // This is used to open or close the instructions screen.
    if(show) {
        let rules = `
            This is Blackjack. You are the player. The dealer is the computer. blah blah blah 
            blah blah
        `;
    } else {
    
    }
}