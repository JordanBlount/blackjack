let pickOne = "yoda.png";
let pickTwo = "";

let selectedCard = (card) => {
    if(pickOne === "") {
        pickOne = card.imgSrc;
    } else { // pickOne contains an image already
        if(pickTwo == "") {
            pickTwo = card.imgSrc;
            // You now have two images
            let weHaveAMatch = match(pickOne, pickTwo);
            if(weHaveAMatch) {
                // WE HAVE A MATCH
                // Push them to array
            } else {
                // WE DONT HAVE A MATCH
                // Flip cards back over
                
            }
        }
    }
}

let match = (pick1, pick2) => {
    if(pick1 === pick2) {
        return true;
    }
    return false;
}