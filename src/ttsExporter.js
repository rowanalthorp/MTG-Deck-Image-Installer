export function buildTTSJSON(saveName, cards) {
    const deckIds = [];
    const customDeck = {};
    const containedObjects = [];

    cards.forEach((card, index) => {
        const sheetKey = String(index + 1);
        const cardId = (index + 1) * 100; // 100, 200, 300, ...

        deckIds.push(cardId);

        customDeck[sheetKey] = {
            FaceURL: card.imageUri || card.image_url || card.image || "",
            BackURL: "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg",
            NumWidth: 1,
            NumHeight: 1,
            BackIsHidden: true,
            UniqueBack: false,
            Type: 0
        };

        containedObjects.push({
            Name: "Card",
            Nickname: card.name || "",
            CardID: cardId,
            });
    });

    const deckObject = {
        Name: "DeckCustom",
        Nickname: saveName || "My Generated Deck",
        Transform: { posX: 0, posY: 1, posZ: 0, rotX: 0, rotY: 180, rotZ: 180, scaleX: 1, scaleY: 1, scaleZ: 1 },
        DeckIDs: deckIds,
        CustomDeck: customDeck,
        ContainedObjects: containedObjects
    };

    return {
        SaveName: saveName || "My Custom Deck",
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
        ObjectStates: [deckObject]
    };
}