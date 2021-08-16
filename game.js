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
                let loc1 = Math.floor(Math.random() * (j + 1));
                let loc2 = Math.floor(Math.random() * (j + 1));
                let firstCard = this.cards[loc1];
    
                // Swaps the card locations
                this.cards[loc1] = this.cards[loc2];
                this.cards[loc2] = firstCard;
            }
        } 
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

    lowerBet(amount) {
        this.bet -= amount;
    }

    raiseBet(amount) {
        this.bet += amount;
    }

    // Checks to see if player can even make a certain bet
    // e.g., player 1 bets 200 (amount) but only has 300 (this.cash). They can not make that bet
    canBet(amount) {
        return this.cash >= amount ? true : false;
    }

    addCash(amount) {
        this.cash += amount;
    }

    removeCash(amount) {
        this.cash -= amount;
    }

    currentCash() {
        return this.cash;
    }

    currentPoints() {
        return this.points;
    }

    currentBet() {
        return this.bet;
    }
}

class Dealer extends Player {

    constructor(name, hand, points, cash, bet, isDealer) {
        super(name, hand, points, cash, bet, isDealer);
    }

    dealTwoCards(deck, player) {
        player.addCards([deck.pickCardFromTop(), deck.pickCardFromTop()]); 
    }

    dealCard(deck, player) {
        let card = deck.pickCardFromTop();
        console.log(`${player.name} was given a ${card.suit} [${card.value}]`)
        player.addCards(card);
    }

    dealACard(deck, card, player) {
        let crd = deck.giveCard(card);
        console.log(`${player.name} was given a ${crd.suit} [${crd.value}]`)
        player.addCards(crd);
    }

}

let player1 = null;
let dealer = null;
let currentTurn = 1;
let round = 1;
let deck = null;

const whosTurnIsIt = () => {
    // A way of seeing who is currently going
    return  currentTurn == 1 ? player1 : dealer;
}

const changeTurns = () => {
    if(currentTurn === 1) {
         currentTurn = 2; 
         dealerMove();
         // Update game to show whose turn it is
    } else {
        currentTurn = 1;
        // Update game to show whose turn it is
    }
}

const hit = (player) => {
    if(!player.isBusted()) {
        dealer.dealCard(deck, player);
        console.log(player.hand);
        console.log(`Points: ${player.points}`);
        // Checks to see if you have busted ater receiving a card
        if(player.isBusted()) {
            // TODO: Add a function to reveal the dealer's cards
            checkForRoundWinner();
        }
    } else {
        // This should never happen technically
        // ACTUALLY, this should happen if the button and pressed and you are busted
        checkForRoundWinner();
    }
}

const stay = (player) => {
    if(!player.isBusted()) {
        console.log(`${player.name} chose to stay!`);
        // This means that the dealer has ended their turn and the game should now check to see who won
        if(player.isDealer) {
            // TODO: Add a function to reveal the dealer's cards
            checkForRoundWinner();
        } else {
            // Changes the turn over to the next player (dealer)
            changeTurns();
        }
    } else {
        checkForRoundWinner();
    }
}

const setupGame = (firstGame) => {
    player1 = new Player("Player 1", [], 0, 500, 0, false);
    dealer = new Dealer("House", [], 0, 0, 0, true);
    deck = createDeck();
    deck.shuffle();

    dealer.dealTwoCards(deck, player1);
    dealer.dealTwoCards(deck, dealer);
}

const dealerMove = () => {
    // This allows the computer to keep making choices until it bust or chooses to stay
    let savedRound = round;
    while(!dealer.isBusted()) {
        if(savedRound === round) {
            let choice = Math.floor(Math.random() * 2);
            if(choice === 0) {
                hit(dealer);
            } else {
                stay(dealer);
                break;
            }   
        } else {
            // This makes the loop stop completely because it was causing a problem
            // where the computer was still trying to go even after the round ended (doing actions from previous round)
            console.log("The loop successfully ended");
            break;
        }
    }
}

// TODO: Add a check for when someone busts here instead of it being in the "hit" function
// FIXME: Make sure that this is accurately checking for when the player (or dealer) beats the other
// without going over 21.
const checkForRoundWinner = () => {
    if(!player1.isBroke()) {
        if(!player1.isBusted() && dealer.isBusted()) {
            player1.addCash(player1.currentBet());
            checkIfOver();
        } else if(player1.isBusted() && !dealer.isBusted()) {
            player1.removeCash(player1.currentBet());
            checkIfOver();
        } else if(player1.points === 21) {
            player1.addCash(player.currentBet())
            checkIfOver();
        } else if(dealer.points === 21) {
            player1.removeCash(player.currentBet());
            checkIfOver();
        } else {
            // Neither player has busted
            if(player1.points > dealer.points && !player1.isBusted()) {
                // Player wins
                // Send "You win message"
                // Update module or buttons (to be able to prompt for next round)
                player1.addCash(player1.currentBet());
                checkIfOver();
            } else if(dealer.points > player1.points && !dealer.isBusted()) {
                // Dealer wins
                // Send "You lose message"
                // Update module or buttons (to be able to prompt for next round)
                player1.removeCash(player1.currentBet());
                checkIfOver();
            } else if(player1.points === dealer.points) {
                // It's a tie
                // Player loses no money
                console.log("You all tied");
                checkIfOver();
            }
        }
    } else {
        checkIfOver();
    }
}


const resetForNewRound = () => {
    player1.hand = [];
    player1.bet = 0;
    player1.points = 0;

    dealer.hand = [];
    dealer.points = 0;
    currentTurn = 1;

    deck = createDeck();
    // Remove any winning notifications or things like that
}

const totalReset = () => {
    player = null;
    dealer = null;
    deck = null;
    currentTurn = 1;
    // Open intro screen
}

const nextRound = () => {
    round++;
    resetForNewRound();
}

const checkIfOver = () => {
    // Logic for if player reachs a certain amount of cash or if plays 8 rounds successfully
    if(player1.isBroke()) {
        gameOver();
    } else if(round === 8 || player1.currentCash() === 2000) {
        gameOver();
    } else {
        nextRound();
    }
}

const gameOver = () => {
    if(player1.isBroke()) {
        // You lost the game!
        // Play again?
        totalReset();
        setupGame();
    } else {
        // Show winning screen!
        // Player again?
        totalReset();
        setupGame();
    }
}

// TODO: Change all my functions to const

// Test version of the game that runs in console For debugging purposes only.
let testGame = () => {
    player1 = new Player("Player 1", [], 0, 500, 0, false);
    dealer = new Dealer("House", [], 0, 0, 0, true);
    deck = createDeck();
    deck.shuffle();

    dealer.dealTwoCards(deck, player1);
    dealer.dealTwoCards(deck, dealer);

    player1.setBet(250);

    console.log("###########################");
    console.log(`Player 1's current cash: ${player1.currentCash()} Bet: ${player1.currentBet()}`);
    console.log(player1.hand);
    console.log(`Points: ${player1.points}`);
    console.log(`House's current cash: ${dealer.currentCash()}`);
    console.log(dealer.hand);
    console.log(`Points: ${dealer.points}`);

    stay(player1);
    console.log("###########################");
}

testGame();

// TODO: VISUALS FOR GAMES

// Screen that shows the rules of the game
let showInstructions = (show) => {
    // This is used to open or close the instructions screen.
    if(show) {
        let rules = `
            This is Blackjack. You are the player. The House is the computer. The rules of the game
            are very simple. Whoever gets closer to 21 (or gets 21) wins OR whoever does not bust first
            will win the round. There are 8 rounds in total. If you successfully stay alive without losing
            all of your money during these 8 rounds, you will win the game. You also win if you reach $2000.

            Good luck!
        `;
    } else {
    
    }
}

let chipsToReceive = (amount) => {
    let hundreds = 0;
    let fifties = 0;
    let twenties = 0;
    let tens = 0;
}