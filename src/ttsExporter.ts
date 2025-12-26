export function buildTTSJSON(deckName: string, cards: { name: string; imageUri: string }[]) {
    if (cards.length === 0) {
      throw new Error("Deck must contain at least one card.");
    }

    const deckIDs = cards.map((_, index) => 1000 + index + 1); // Perhaps change this later
  
    const containedObjects = cards.map((card, index) => ({
      Name: "Card",
      Nickname: card.name || "Card",
      CardID: deckIDs[index]
    }));
  
    const customDeck = {
      "1": {
        FaceURL: cards[0].imageUri,
        BackURL: "https://imgur.com/gallery/magic-gathering-card-back-19zDFYc",
        NumWidth: 1,
        NumHeight: cards.length,
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
  