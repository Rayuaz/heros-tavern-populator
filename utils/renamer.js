import { pb } from "./lib/pocketbaseConfig.js";
import fs from "fs/promises";

/*

-- RENAMER --

This script searches and replaces text from the database. I created it to replace trademarked names, because the AI
really likes using them, and I don't want to get sued. To use it, just change the variables `search` and `replace`, and run
the script.

*/

const backup = { data: [] };
const search = "search"; // The text to be replaced
const replace = "replace"; // The replacement text
const searchRegex = new RegExp(`\\b${search}\\b`, "gi");

try {
    const res = await pb.collection("characters").getFullList({
        filter: `name ~ '${search}' || prompt ~ '${search}' || characteristics ~ '${search}' || appearance ~ '${search}' || connections ~ '${search}'`,
    });

    res.forEach(async (item) => {
        backup.data = [...backup.data, item];
        await fs.writeFile("./renamerBackup.json", JSON.stringify(backup));
    });

    res.forEach(async (item) => {
        let name = item.name;
        let prompt = item.prompt;
        let characteristics = item.characteristics;
        let appearance = item.appearance;
        let connections = item.connections;

        if (name.match(searchRegex)) {
            name = name.replace(searchRegex, replace);
        }
        if (prompt.match(searchRegex)) {
            prompt = prompt.replace(searchRegex, replace);
        }
        if (characteristics.match(searchRegex)) {
            characteristics = characteristics.replace(searchRegex, replace);
        }
        if (appearance.match(searchRegex)) {
            appearance = appearance.replace(searchRegex, replace);
        }
        if (connections.match(searchRegex)) {
            connections = connections.replace(searchRegex, replace);
        }

        const record = await pb
            .collection("characters")
            .update(item.id, { name, prompt, characteristics, appearance, connections });

        console.log(record);
        console.log("------------------");
        console.log("------------------");
        console.log("------------------");
    });
} catch (error) {
    console.log("Error:", error);
}
