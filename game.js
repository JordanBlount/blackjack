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
    constructor(name, hand, isDealer) {
        this.name = name;
        this.hand = hand;
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