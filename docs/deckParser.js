export function parseDeck(text) {
    return text
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean)
        .map(line => {
        const cleanLine = line.replace(/\^.*\^/, '').trim();
        const match = cleanLine.match(/^(\d+)x\s+([^\(\[]+)/);
        if (!match)
            return null;
        return { qty: parseInt(match[1]), name: match[2].trim() };
    })
        .filter((e) => e !== null);
}
