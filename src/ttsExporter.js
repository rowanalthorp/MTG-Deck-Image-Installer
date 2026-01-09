export function buildTTSJSON(deckName, cards) {
    if (cards.length === 0) {
        throw new Error("Deck must contain at least one card.");
    }

    const customDeck = {};
    const deckIDs = [];
    const containedObjects = [];

    // TTS Grid Settings
    const cardsPerSheet = 70; // 10x7 grid
    const cardBackUrl = "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg/revision/latest?cb=20140813141013";

    cards.forEach((card, index) => {
        // 1. Calculate which sheet this card is on (0-69 is Sheet 1, 70-99 is Sheet 2)
        const sheetIndex = Math.floor(index / cardsPerSheet);
        const deckId = sheetIndex + 1; // Deck IDs usually start at 1

        // 2. Calculate the CardID
        // Format: (DeckID * 100) + (Position on sheet)
        // Card 1 on Sheet 1: 100. Card 70 on Sheet 1: 169.
        // Card 1 on Sheet 2: 200.
        const positionOnSheet = index % cardsPerSheet;
        const cardId = (deckId * 100) + positionOnSheet;
        
        deckIDs.push(cardId);

        // 3. Define the sheet image in CustomDeck (only once per sheet)
        if (!customDeck[deckId]) {
            customDeck[deckId.toString()] = {
                // IMPORTANT: This 'FaceURL' must be the URL of the 10x7 SPRITE SHEET image,
                // not an individual card image.
                FaceURL: card.sheetUri || card.imageUri, 
                BackURL: cardBackUrl,
                NumWidth: 10,
                NumHeight: 7,
                BackIsHidden: true,
                UniqueBack: false,
                Type: 0
            };
        }

        // 4. Create the Card Object for searching
        containedObjects.push({
            Name: "Card",
            Nickname: card.name || "Card",
            CardID: cardId,
            Transform: {
                posX: 0, posY: 0, posZ: 0,
                rotX: 0, rotY: 180, rotZ: 180,
                scaleX: 1, scaleY: 1, scaleZ: 1
            }
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
                CustomDeck: customDeck,
                ContainedObjects: containedObjects
            }
        ]
    };
}