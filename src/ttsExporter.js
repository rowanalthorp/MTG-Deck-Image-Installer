const buildTTSJSON = (cards) => {
    // Helper to generate a random 6-character GUID for TTS
    const generateGUID = () => Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    const customDeck = {};
    const deckIDs = [];
    
    // 1. Build the CustomDeck definitions and ID list
    cards.forEach((card, index) => {
        const id = (index + 1) * 100; // Generate IDs like 100, 200, 300...
        const deckKey = (index + 1).toString();
        
        deckIDs.push(id);
        customDeck[deckKey] = {
            FaceURL: card.image,
            BackURL: "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg/revision/latest?cb=20140813141013",
            NumWidth: 1,
            NumHeight: 1,
            BackIsHidden: true,
            UniqueBack: false,
            Type: 0
        };
    });

    // 2. Create the Deck object (the container)
    const deckObject = {
        GUID: generateGUID(),
        Name: "Deck", // Changed from "DeckCustom" to match rahh.json
        Nickname: "My Custom Deck",
        Transform: {
            posX: 0, posY: 1, posZ: 0,
            rotX: 0, rotY: 180, rotZ: 180, // Facing down
            scaleX: 1, scaleY: 1, scaleZ: 1
        },
        DeckIDs: deckIDs,
        CustomDeck: customDeck,
        Grid: true,
        Snap: true,
        Sticky: true,
        Autoraise: true,
        Hands: true,
        SidewaysCard: false,
        // The cards MUST be inside this array
        ContainedObjects: cards.map((card, index) => {
            const id = (index + 1) * 100;
            const deckKey = (index + 1).toString();
            return {
                GUID: generateGUID(),
                Name: "Card",
                Nickname: card.name,
                CardID: id,
                CustomDeck: {
                    [deckKey]: customDeck[deckKey]
                },
                Transform: {
                    posX: 0, posY: 1, posZ: 0,
                    rotX: 0, rotY: 180, rotZ: 180,
                    scaleX: 1, scaleY: 1, scaleZ: 1
                }
            };
        })
    };

    // 3. Wrap in the Save File structure
    return {
        SaveName: "Generated Deck",
        Date: new Date().toISOString(),
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
        ObjectStates: [deckObject] // The deck is an element in the Save array
    };
};