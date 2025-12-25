export async function fetchCard(name: string) {
    const res = await fetch(
    `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}`
    );
    if (!res.ok) throw new Error(`Card is not found: ${name}`);
    return await res.json(); // Maybe can minimize amount of json data retriving
}

export function getImageURL(cardData: any) {
    return cardData.image_uris?.normal ?? cardData.card_faces?.[0]?.image_uris?.normal;
}
