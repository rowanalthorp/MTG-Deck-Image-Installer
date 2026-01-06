export async function chooseFolder() {
    // @ts-ignore
    return await window.showDirectoryPicker();
}

export async function ensureDir(parent, name) {
    return await parent.getDirectoryHandle(name, { create: true });
}

export async function writeFile(dir, name, data) {
    const handle = await dir.getFileHandle(name, { create: true });
    const writable = await handle.createWritable();

    const blob = typeof data === "string"
        ? new Blob([data], { type: "application/json" })
        : data;

    await writable.write(blob);
    await writable.close();
}