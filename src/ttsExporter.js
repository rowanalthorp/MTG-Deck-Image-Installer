// Helper to generate the 6-character hex GUIDs TTS requires
const generateGUID = () => Math.random().toString(16).substring(2, 8);

function generateTTSDeck(cards) {
    const deckGUID = generateGUID();
    const deckIds = [];
    const customDeck = {};
    const containedObjects = [];

    cards.forEach((card, index) => {
        const cardId = (index + 1) * 100; // Standard TTS ID format
        deckIds.push(cardId);

        // Define the custom image for this specific card
        customDeck[index + 1] = {
            FaceURL: card.image_url,
            BackURL: "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg",
            NumWidth: 1,
            NumHeight: 1,
            BackIsHidden: true,
            UniqueBack: false,
            Type: 0
        };

        // Define the individual card object inside the deck
        containedObjects.push({
            Name: "Card",
            Nickname: card.name,
            CardID: cardId,
            GUID: generateGUID(),
            Transform: { posX: 0, posY: 0, posZ: 0, rotX: 0, rotY: 180, rotZ: 180, scaleX: 1, scaleY: 1, scaleZ: 1 }
        });
    });

    // The main Deck Object
    const deckObject = {
        Name: "Deck",
        Nickname: "My Generated Deck",
        Transform: { posX: 0, posY: 1, posZ: 0, rotX: 0, rotY: 180, rotZ: 180, scaleX: 1, scaleY: 1, scaleZ: 1 },
        GUID: deckGUID,
        DeckIDs: deckIds,
        CustomDeck: customDeck,
        ContainedObjects: containedObjects
    };

    // The mandatory Wrapper for TTS Save Files
    return {
        SaveName: "My Custom Deck",
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
        ObjectStates: [deckObject] // Put the deck inside the array
    };
}