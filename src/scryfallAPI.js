export async function fetchCard(name) {
    const res = await fetch(
        `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}`
    );
    if (!res.ok) throw new Error(`Card is not found: ${name}`);
    return await res.json(); // You could optimize later to reduce JSON size
}

export function getImageURL(cardData) {
    return cardData.image_uris?.normal ?? cardData.card_faces?.[0]?.image_uris?.normal;
}