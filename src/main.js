import { parseDeck } from "./deckParser.js";
import { fetchCard, getImageURL } from "./scryfallAPI.js";
import { chooseFolder, ensureDir, writeFile } from "./fileSystem.js";
import { buildTTSJSON } from "./ttsExporter.js";

const textarea = document.getElementById("decklist");
const logEl = document.getElementById("log");
let rootDir = null;

function log(msg) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    logEl.textContent += `[${timestamp}] ${msg}\n`;
    logEl.scrollTop = logEl.scrollHeight;
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

const supportsFileSystem = "showDirectoryPicker" in window;

document.getElementById("chooseFolder").addEventListener("click", async () => {
    if (!supportsFileSystem) {
        alert("Your browser does not support folder selection. Will use direct download instead.");
        return;
    }
	try {
	  rootDir = await chooseFolder();
	  log("Folder selected!");
	} catch (err) {
	  log("Folder selection canceled.");
	}
});

document.getElementById("run").addEventListener("click", async () => {
    const deckEntries = parseDeck(textarea.value);
    if (!deckEntries.length) return alert("Paste a deck list first!");
    log(`Parsed ${deckEntries.length} cards`);

    const useFolder = !!rootDir;
    const allCards = [];

    for (const entry of deckEntries) {
        try {
            log(`Fetching ${entry.name}`);
            const cardData = await fetchCard(entry.name);
            const imgURL = getImageURL(cardData);
            if (!imgURL) continue;

            allCards.push({ name: entry.name, image: imgURL, qty: entry.qty });
            
            if (useFolder) {
                const imagesDir = await ensureDir(rootDir, "images");
                const res = await fetch(imgURL);
                const blob = await res.blob();
                const safeName = entry.name.replace(/[\/\\:?*"<>|]/g, "");
                await writeFile(imagesDir, `${safeName}.jpg`, blob);
            }
        } catch (err) {
            log(`Error fetching ${entry.name}: ${err.message}`);
        }
    }

    const cardsForTTS = allCards.map(card => ({
        name: card.name,
        imageUri: card.image,
        qty: card.qty
    }));

    const ttsJSON = buildTTSJSON("My Custom Deck", cardsForTTS);

    if (useFolder && rootDir) {
        const ttsBlob = new Blob([JSON.stringify(ttsJSON, null, 2)], { type: "application/json" });
        await writeFile(rootDir, "tts_deck.json", ttsBlob);
        log("Saved to folder!");
    } else {
        downloadJSON(ttsJSON, "mtg_deck.json");
        log("JSON downloaded!");
    }

    log("Done!");
});