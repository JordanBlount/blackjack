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
        // Shuffles the deck 2 times
        for(let i = 0; i < 2; i++) {
            // Goes through all 52 cards.
            // FIXME: This logic could be made better, but it works
            for(let j = 0; j < this.cards.length - 1; j++) {
                let loc1 = Math.floor(Math.random() * this.cards.length);
                let loc2 = Math.floor(Math.random() * this.cards.length);
                let firstCard = this.cards[loc1];
    
                // Swaps the card locations
                this.cards[loc1] = this.cards[loc2];
                this.cards[loc2] = firstCard;
            }
        } 
    }

    shuffle() {

    }

    // Removes specific card from array
    removeCard(card) {
        this.cards.slice(this.cards.indexOf(card), 1);
    }

    giveCard(card) {
        return this.cards.splice(this.cards.indexOf(card), 1)[0];
    }

    // This removes the card from the top of the deck
    // It return the card that was removed
    pickCardFromTop() {
        return this.cards.shift();
    }

    amountOfCard(cardVal) {
        return this.cards.reduce((total, card) => {
            if(card.value === cardVal) {
                total += 1;
            }
            return total;
        }, 0);
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

class Player {

    // We want to give the player a name, the current cards in their hand,
    // and what is their turn which I may give them based on their current
    // position in the players' array (if I add multiple players)
    constructor(name, hand, points, cash, bet, isDealer) {
        this.name = name;
        this.hand = hand;
        this.points = points;
        this.cash = cash;
        this.bet = bet;
        this.isDealer = isDealer;
    }

    isDealer() {
        return this.isDealer;
    }

    handTotal() {
        let total = 0;
        
        // Gets the point value for all the cards except for Aces
        total = this.hand.reduce((amount, card) => {
            if(card.value !== "A") {
                amount += card.points[0];
            }
            return amount;
        }, 0);

        // Determine the value of the player's hand. If that value
        // + the value of the amount of Aces (e.g., if there are
        // 2 aces: 11 + 1 or 1 + 1 if the first condition would give
        // the player more than 21)
        let aces = this.amountOfAces();
        if(aces > 0) {
            if((total + 11) > 21) {
                total += aces;
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
            return total;
        }, 0); // Has to have an initial value
    }

    hasAces() {
        return this.amountOfAces() > 0;
    }

    isBusted() {
        return this.points > 21;
    }

    isBroke() {
        return this.cash <= 0;
    }

    addPoints(card) {
        // Adds points for all non-Ace cards
        if(card.value !== "A") {
            this.points += card.points[0];
        } else {
            let aces = this.amountOfAces();
            // If there are 1 or more Aces already in the player's hand, add 1 point
            if(aces >= 1) {
                this.points += card.points[0];
            } else {
                // If adding one Ace brings the points above 21, add 1 point only
                if((this.points + 11) > 21) {
                    this.points += card.points[0];
                // otherwise, add 11
                } else {
                    this.points += card.points[1];
                }
            }
        }
    }

    addCards(cards) {
        // If multiple cards are added
        if(Array.isArray(cards)) {
            cards.map(card => {
                // console.log("Added multiple cards");
                this.addPoints(card)
                this.hand.push(card);
            });   
        } else {
            // Adds a single card
            // console.log("Added single card");
            this.addPoints(cards);
            this.hand.push(cards);
        }
    }
    
    setBet(bet) {
        this.bet = bet;
    }

    currentBet() {
        return this.bet;
    }

    lowerBet(amount) {
        this.bet -= amount;
    }

    // Checks to see if player can even make a certain bet
    // e.g., player 1 bets 200 (amount) and they already betting 150 (this.bet)
    // but only has 300 (this.cash). They can not make that bet
    canBet(amount) {
        return this.cash >= (this.bet + amount) ? true : false;
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

    get currentPoints() {
        return this.points;
    }
}

class Dealer extends Player {
    constructor(name, hand, points, cash, bet, isDealer) {
        super(name, hand, points, cash, bet, isDealer);
    }

    dealTwoCards(cards, player) {
        player.addCards([deck.pickCardFromTop(), deck.pickCardFromTop()]); 
    }

    dealCard(deck, player) {
        player.addCards(deck.pickCardFromTop());
    }

    dealACard(deck, card, player) {
        player.addCards(deck.giveCard(card));
    }

}

let player1 = null;
let dealer = null;
let currentTurn = 1;
let deck = createDeck();

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

player1 = new Player("Jordan", [], 0, 100, 0, false);
dealer = new Dealer("House", [], 0, 100, 0, true);

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