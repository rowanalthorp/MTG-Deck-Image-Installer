export function buildTTSJSON(deckName, cards) {
    if (cards.length === 0) {
        throw new Error("Deck must contain at least one card.");
    }

    const customDeck = {};
    const deckIDs = [];
    const containedObjects = [];

    cards.forEach((card, index) => {
        // rahh.json uses IDs like 100, 200, etc. 
        // Your logic index + 1 * 100 is correct for sequential 1x1 sheets
        const deckId = index + 1;
        const cardId = deckId * 100;

        deckIDs.push(cardId);

        // Every card is its own 1x1 grid (Standard for Scryfall-based decks)
        customDeck[deckId.toString()] = {
            FaceURL: card.imageUri,
            BackURL: "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg/revision/latest?cb=20140813141013",
            NumWidth: 1,
            NumHeight: 1,
            BackIsHidden: true,
            UniqueBack: false,
            Type: 0
        };

        // Add the extra metadata found in rahh.json to each card
        containedObjects.push({
            Name: "Card",
            Nickname: card.name,
            CardID: cardId,
            // Added properties from rahh.json to ensure proper interaction
            Grid: true,
            Snap: true,
            Locked: false,
            Hands: true, 
            SidewaysCard: false,
            Tooltip: true,
            HideWhenFaceDown: true,
            Autoraise: true,
            Sticky: true,
            ColorDiffuse: { r: 0.713, g: 0.713, b: 0.713 },
            CustomDeck: {
                [deckId.toString()]: customDeck[deckId.toString()]
            }
        });
    });

    // This creates the internal "ObjectState"
    const deckObject = {
        Name: "Deck", // Changed from "DeckCustom" to match rahh.json
        Nickname: deckName || "",
        Transform: { 
            posX: 2.55, posY: 2.13, posZ: -0.85, // Matches rahh.json's position
            rotX: 0, rotY: 90, rotZ: 0,        // Matches rahh.json's orientation
            scaleX: 1, scaleY: 1, scaleZ: 1 
        },
        Description: "",
        GMNotes: "",
        ColorDiffuse: { r: 0.713, g: 0.713, b: 0.713 },
        Locked: false,
        Grid: true,
        Snap: true,
        Autoraise: true,
        Sticky: true,
        Tooltip: true,
        GridProjection: false,
        HideWhenFaceDown: true,
        Hands: true, // Crucial for MTG decks
        DeckIDs: deckIDs,
        CustomDeck: customDeck,
        ContainedObjects: containedObjects
    };

    // FINAL STEP: Wrap it in the TTS Save File format
    return {
        SaveName: "",
        Date: "",
        VersionNumber: "",
        GameMode: "",
        GameType: "",
        GameComplexity: "",
        Tags: [],
        Gravity: 0.5,
        PlayArea: 0.5,
        Table: "",
        Sky: "",
        Note: "",
        TabStates: {},
        LuaScript: "",
        LuaScriptState: "",
        XmlUI: "",
        ObjectStates: [deckObject] // rahh.json stores the deck inside this array
    };
}