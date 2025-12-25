export function buildTTSJSON(deckName: string, cards: { name: string; imageUri: string }[]) {
    if (cards.length === 0) {
      throw new Error("Deck must contain at least one card.");
    }
  
    // Generate unique CardIDs starting at 1001
    const deckIDs = cards.map((_, index) => 1000 + index + 1);
  
    // ContainedObjects: minimal info per card
    const containedObjects = cards.map((card, index) => ({
      Name: "Card",
      Nickname: card.name || "Card",
      CardID: deckIDs[index]
    }));
  
    // Single CustomDeck for all cards
    const customDeck = {
      "1": {
        FaceURL: cards[0].imageUri, // For single card sheets, this is fine
        BackURL: "https://deckmaster.info/images/cards/back.jpg",
        NumWidth: 1,
        NumHeight: cards.length, // one card per row
        BackIsHidden: true,
        UniqueBack: false,
        Type: 0
      }
    };
  
    return {
      SaveName: deckName,
      Date: "",
      VersionNumber: "",
      ObjectStates: [
        {
          Name: "DeckCustom",
          Nickname: deckName,
          Transform: {
            posX: 0,
            posY: 1,
            posZ: 0,
            rotX: 0,
            rotY: 180,
            rotZ: 180,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1
          },
          DeckIDs: deckIDs,
          CustomDeck: customDeck,
          ContainedObjects: containedObjects
        }
      ]
    };
  }
  