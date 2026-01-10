// Helper to generate the 6-character hex GUIDs TTS requires
const generateGUID = () => Math.random().toString(16).substring(2, 8);

/**
 * Build a Tabletop Simulator JSON save object containing a single deck.
 *
 * - saveName: string used for SaveName and Deck nickname
 * - cards: an array of card objects where each entry is one physical card copy:
 *    { name: "...", imageUri: "https://..." }
 *
 * This function expects each card passed to be a single copy (if your decklist has quantities,
 * expand them into duplicate entries before calling this).
 */
export function buildTTSJSON(saveName, cards) {
  // Unique GUID for the deck container
  const deckGUID = generateGUID();

  const deckIds = [];
  const customDeck = {};
  const containedObjects = [];

  // For single-card-per-sheet approach we use 1x1 sheets.
  // Each custom sheet gets a string key "1","2",...
  // Each card's CardID will be (index+1) * 100, which is a valid TTS card id
  // when the sheet is 1x1
 
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
      GUID: generateGUID(),
      Transform: { posX: 0, posY: 0, posZ: 0, rotX: 0, rotY: 180, rotZ: 180, scaleX: 1, scaleY: 1, scaleZ: 1 }
    });
  });

  const deckObject = {
    Name: "DeckCustom",
    Nickname: saveName || "My Generated Deck",
    Transform: { posX: 0, posY: 1, posZ: 0, rotX: 0, rotY: 180, rotZ: 180, scaleX: 1, scaleY: 1, scaleZ: 1 },
    GUID: deckGUID,
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