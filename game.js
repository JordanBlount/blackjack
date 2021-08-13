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

    // We can either fill a deck with a set of cards passed into it
    // or it will automatically be created for us.
    constructor(cards) {
        this.cards = cards;
    }

    shuffle() {
    
    }

    create() {
        let cardsArray = [];

        cardsArray = suit.flatMap(suit => {
            return values.map(value => {
                return new Card(suit, value, []);
            })
        });
    
        // TODO: I may be able to remove this logic because I can change the
        // way that my game works to not have to do it this way.
        cardsArray.map(card => {
            if(card.value === "J" || card.value === "Q" || card.value === "K") {
                card.points.push(10);
            } else if(card.value === "A") {
                card.points.push(1, 11);
            } else {
                card.points.push(parseInt(card.value));
            }
        });
        this.cards = cardsArray;    
    }
}

let deck = new Deck();
deck.create();

console.log(deck.cards[12]);
console.log(deck.cards[12].isAce());