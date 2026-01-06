import JSZip from "jszip";
import { parseDeck } from "./deckParser.js";
import { fetchCard, getImageURL } from "./scryfallAPI.js";
import { chooseFolder, ensureDir, writeFile } from "./fileSystem.js";
import { buildTTSJSON } from "./ttsExporter.js";

const textarea = document.getElementById("decklist");
const logEl = document.getElementById("log");
let rootDir = null;

function log(msg) {
    logEl.textContent += msg + "\n";
}

function downloadBlob(blob, filename) {
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
        alert("Your browser does not support folder selection. Will use ZIP download instead.");
        return;
    }
    rootDir = await chooseFolder();
    log("Folder selected!");
});

document.getElementById("run").addEventListener("click", async () => {
    const deckEntries = parseDeck(textarea.value);
    if (!deckEntries.length) return alert("Paste a deck list first!");
    log(`Parsed ${deckEntries.length} cards`);

    const useFolder = !!rootDir;
    const zip = useFolder ? null : new JSZip();
    const imagesDir = useFolder ? await ensureDir(rootDir, "images") : null;

    const allCards = [];

    for (const entry of deckEntries) {
        try {
            log(`Fetching ${entry.name}`);
            const cardData = await fetchCard(entry.name);
            const imgURL = getImageURL(cardData);
            if (!imgURL) continue;

            allCards.push({ name: entry.name, image: imgURL, qty: entry.qty });
            const res = await fetch(imgURL);
            const blob = await res.blob();
            const safeName = entry.name.replace(/[\/\\:?*"<>|]/g, "");

            if (useFolder && imagesDir) {
                await writeFile(imagesDir, `${safeName}.jpg`, blob);
            } else if (zip) {
                for (let i = 0; i < entry.qty; i++) {
                    zip.file(`${safeName}-${i + 1}.jpg`, blob);
                }
            }
        } catch (err) {
            log(`Error fetching ${entry.name}: ${err.message}`);
        }
    }

    const cardsForTTS = allCards.map(card => ({
        name: card.name,
        imageUri: card.image
    }));
    const ttsJSON = buildTTSJSON("My Custom Deck", cardsForTTS);
    const ttsBlob = new Blob([JSON.stringify(ttsJSON, null, 2)], { type: "application/json" });

    if (useFolder && rootDir) {
        await writeFile(rootDir, "tts_deck.json", ttsBlob);
    } else if (zip) {
        zip.file("tts_deck.json", ttsBlob);
        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadBlob(zipBlob, "mtg_deck.zip");
    }

    log("Done!");
});