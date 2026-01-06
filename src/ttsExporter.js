export function buildTTSJSON(deckName, cards) {
    if (cards.length === 0) {
        throw new Error("Deck must contain at least one card.");
    }

    const customDeck = {};
    const deckIDs = [];
    const containedObjects = [];

    cards.forEach((card, index) => {
        // 1. Create a unique ID for this card's "deck" (1, 2, 3...)
        const deckId = index + 1;
        
        // 2. Generate the CardID (e.g., 100, 200, 300...)
        // TTS uses the last two digits (00) as the index on the image
        const cardId = deckId * 100;
        deckIDs.push(cardId);

        // 3. Add this card to the CustomDeck registry
        customDeck[deckId.toString()] = {
            FaceURL: card.imageUri,
            BackURL: "https://i.imgur.com/19zDFYc.png", // Use a direct link to the image
            NumWidth: 1,
            NumHeight: 1,
            BackIsHidden: true,
            UniqueBack: false,
            Type: 0
        };

        // 4. Create the actual card object
        containedObjects.push({
            Name: "Card",
            Nickname: card.name || "Card",
            CardID: cardId
        });
    });

    return {
        SaveName: deckName,
        Date: "",
        VersionNumber: "",
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
                CustomDeck: customDeck,
                ContainedObjects: containedObjects
            }
        ]
    };
}