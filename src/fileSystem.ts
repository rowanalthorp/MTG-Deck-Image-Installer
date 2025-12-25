type DirHandle = any;
export async function chooseFolder(): Promise<DirHandle> {
    // @ts-ignore
    return await (window as any).showDirectoryPicker();
}

export async function ensureDir(
    parent: DirHandle,
    name: string
): Promise<DirHandle> {
    return await parent.getDirectoryHandle(name, { create: true });
}

export async function writeFile(
    dir: DirHandle,
    name: string,
    data: Blob | string
) {
    const handle = await dir.getFileHandle(name, { create: true });
    const writable = await handle.createWritable();
    
    const blob =
    typeof data === "string"
      ? new Blob([data], { type: "application/json" })
      : data;

    await writable.write(blob);
    await writable.close();
}
