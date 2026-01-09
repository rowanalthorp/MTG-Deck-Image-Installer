export function buildTTSJSON(deckName, cards) {
    if (cards.length === 0) {
        throw new Error("Deck must contain at least one card.");
    }

    const customDeck = {};
    const deckIDs = [];
    const containedObjects = [];

    cards.forEach((card, index) => {
        // We give each card a unique Deck ID (1, 2, 3...)
        // CardID is always (DeckID * 100)
        const deckId = index + 1;
        const cardId = deckId * 100;

        deckIDs.push(cardId);

        // Every card is its own 1x1 grid
        customDeck[deckId.toString()] = {
            FaceURL: card.imageUri,
            BackURL: "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg/revision/latest?cb=20140813141013", // MTG Back
            NumWidth: 1,
            NumHeight: 1,
            BackIsHidden: true,
            UniqueBack: false,
            Type: 0
        };

        // THIS IS WHAT MAKES IT SEARCHABLE
        containedObjects.push({
            Name: "Card",
            Nickname: card.name, // The search name
            CardID: cardId,      // Must match the math above!
            CustomDeck: {
                [deckId.toString()]: customDeck[deckId.toString()]
            }
        });
    });

    return {
        Name: "DeckCustom",
        Nickname: deckName,
        Transform: { posX: 0, posY: 1, posZ: 0, rotX: 0, rotY: 180, rotZ: 180, scaleX: 1, scaleY: 1, scaleZ: 1 },
        DeckIDs: deckIDs,
        CustomDeck: customDeck,
        ContainedObjects: containedObjects
    };
}