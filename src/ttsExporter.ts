export function buildTTSJSON(deckName: string, cards: any[]) {
    const containedObjects = cards.map((card, index) => {
      const cardId = (index + 1) * 100; 
      const key = (index + 1).toString();
      
      return {
        Name: "Card",
        Nickname: card.name || "MTG Card",
        CardID: cardId,
        Transform: {
          posX: 0, posY: 0, posZ: 0,
          rotX: 0, rotY: 180, rotZ: 180,
          scaleX: 1, scaleY: 1, scaleZ: 1
        },
        CustomDeck: {
          [key]: {
            FaceURL: card.imageUri,
            BackURL: "https://deckmaster.info/images/cards/back.jpg",
            NumWidth: 1,
            NumHeight: 1,
            BackIsHidden: true,
            UniqueBack: false,
            Type: 0
          }
        }
      };
    });
  
    const deckIds = containedObjects.map(obj => obj.CardID);
    
    // Fixes the "Implicit any" indexing error
    const combinedCustomDeck: { [key: string]: any } = {};
    containedObjects.forEach((obj, index) => {
      const key = (index + 1).toString();
      combinedCustomDeck[key] = obj.CustomDeck[key];
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
          DeckIDs: deckIds,
          CustomDeck: combinedCustomDeck,
          ContainedObjects: containedObjects
        }
      ]
    };
  }