export function buildTTSJSON(deckName, cards) {
    if (cards.length === 0) {
        throw new Error("Deck must contain at least one card.");
    }

    const customDeck = {};
    const deckIDs = [];
    const containedObjects = [];

    cards.forEach((card, index) => {
        // We give each card its own "Deck ID" starting at 1
        const deckId = index + 1;
        
        // CardID must be (DeckID * 100). 
        // Example: Deck 1 becomes CardID 100. Deck 2 becomes CardID 200.
        const cardId = deckId * 100;
        deckIDs.push(cardId);

        // We create a SEPARATE entry for every card image in the CustomDeck list
        customDeck[deckId.toString()] = {
            FaceURL: card.imageUri,
            BackURL: "https://i.imgur.com/19zDFYc.png", // Use a direct .png link
            NumWidth: 1,  // Since it's a single image, width is 1
            NumHeight: 1, // Since it's a single image, height is 1
            BackIsHidden: true,
            UniqueBack: false,
            Type: 0
        };

        containedObjects.push({
            Name: "Card",
            Nickname: card.name || "Card",
            CardID: cardId
        });
    });

    return {
        SaveName: deckName,
        ObjectStates: [
            {
                Name: "DeckCustom",
                Nickname: deckName,
                Transform: {
                    posX: 0, posY: 1, posZ: 0,
                    rotX: 0, rotY: 180, rotZ: 180,
                    scaleX: 1, scaleY: 1, scaleZ: 1
                },
                DeckIDs: deckIDs,
                CustomDeck: customDeck, // This now contains all 95 images
                ContainedObjects: containedObjects
            }
        ]
    };
}