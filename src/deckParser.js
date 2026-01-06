export function parseDeck(text) {
    if (!text) return [];

    return text
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean)
        .map(line => {
            // Removes comments or set tags like ^...^ or (SET) 123
            const cleanLine = line.replace(/\^.*\^/, '').replace(/\(.*\).*/, '').trim();
            
            // Matches: "1x Card", "1 Card", or "10x Card"
            // Group 1: Quantity, Group 2: Card Name
            const match = cleanLine.match(/^(\d+)[xX]?\s+(.+)$/);
            
            if (!match) return null;

            return { 
                qty: parseInt(match[1], 10), 
                name: match[2].trim() 
            };
        })
        .filter(e => e !== null);
}