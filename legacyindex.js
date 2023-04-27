import { generateCharacterPrompts, generateCharacterDetails } from "./lib/openAiConfig.js";
import { pb } from "./lib/pocketbaseConfig.js";
import fs from "fs/promises";
import { classes, races } from "./config.js";
import { delay } from "./utils.js";
const oldBackupJson = JSON.parse(await fs.readFile(new URL("./backup.json", import.meta.url)));

let newBackupJson = {};
const combinations = [];

// Combine races and classes togheter
for (let i = 0; i < races.length; i++) {
    for (let ii = 0; ii < classes.length; ii++) {
        combinations.push({
            race: races[i],
            class: classes[ii],
        });
    }
}

// In case the previous run ended prematurely, start from the collection it left off
let lastCombinationIndex = 0;
if (oldBackupJson.lastCombinationIndex !== undefined) {
    lastCombinationIndex = oldBackupJson.lastCombinationIndex;
}

// Loop trough each combination to generate prompts
for (let i = lastCombinationIndex; i < combinations.length; i++) {
    const combination = combinations[i];
    const characterRace = combination.race;
    const characterClass = combination.class;

    console.group(`\u001b[1;44m${characterClass} ${characterRace}s\u001b[0m`);

    // In case the previous run ended prematurely, get the prompts it was using
    let characterPromptsString;
    if (oldBackupJson.lastCharacterPrompts !== undefined && i === lastCombinationIndex) {
        characterPromptsString = oldBackupJson.lastCharacterPrompts;
    } else {
        characterPromptsString = await generateCharacterPrompts(characterRace, characterClass, true, 1);
        console.log("\u001b[1;90mSleeping for 30s ZzZzzZz...\u001b[0m");
        await delay(30000);
    }

    // The result of the API call is a string, which will be split by line and moved to a new array
    const characterPromptsArray = characterPromptsString.split(/\r?\n/);

    // In case the previous run ended prematurely, start from the prompt it left off
    let lastPromptIndex = 0;
    if (oldBackupJson.lastPromptIndex !== undefined && i === lastCombinationIndex) {
        lastPromptIndex = oldBackupJson.lastPromptIndex;
    }

    // Loop through each prompt
    for (let ii = lastPromptIndex; ii < characterPromptsArray.length; ii++) {
        let characterPrompt = characterPromptsArray[ii];

        // Sometimes the split returns empty strings
        if (characterPrompt != "") {
            // Sometimes the response enumerates the lines, and sometimes it doesn't.
            if (characterPrompt.match(/\d+(\.|\))\s?/)) {
                characterPrompt = characterPrompt.replace(/\d+(\.|\))\s?/, "");
            }

            // Sometimes the response is wrapped in quotation marks, and sometimes it doesn't.
            characterPrompt = characterPrompt.replace('"', "");

            // Write the current state to a file, so that the script can resume from where it left off if something stops it prematurely
            newBackupJson = {
                ...oldBackupJson,
                lastCombinationIndex: i,
                lastCharacterPrompts: characterPromptsString,
                lastPromptIndex: ii,
            };
            await fs.writeFile("./backup.json", JSON.stringify(newBackupJson));

            const characterName = characterPrompt.match(/^\w+(\w|\s|-)+(?=,)/)[0]; // Matches the text until the first comma, which should be the character's name

            console.group(`\u001b[1;34m${characterName}\u001b[0m`);
            console.log(`\u001b[1;90m${characterPrompt}\u001b[0m`);

            const characterSpeechPattern = await generateCharacterDetails("speech", characterPrompt);
            console.log("\u001b[1;90mSleeping for 30s ZzZzzZz...\u001b[0m");
            await delay(30000);
            const characterCharacteristics = await generateCharacterDetails("characteristics", characterPrompt, characterSpeechPattern);

            // The API limits the requests to 3 per minute. This delay garantees the rate limit won't be reached
            console.log("\u001b[1;90mSleeping for minute ZzZzzZz...\u001b[0m");
            await delay(60000);

            const characterAppearance = await generateCharacterDetails("appearance", characterPrompt, characterSpeechPattern);
            const characterConnections = await generateCharacterDetails("connections", characterPrompt, characterSpeechPattern);

            // const backgroundPrompt = `Name: ${characterName}
            // Summary: ${characterPrompt}
            // Characteritics: ${characterCharacteristics}
            // Appearance: ${characterAppearance}
            // Connections: ${characterConnections}`;

            // const characterBackground = await generateCharacterDetails("background", backgroundPrompt, characterSpeechPattern);

            try {
                await pb.collection("characters").create({
                    name: characterName,
                    race: characterRace,
                    class: characterClass,
                    prompt: characterPrompt,
                    speechPattern: characterSpeechPattern,
                    characteristics: characterCharacteristics,
                    appearance: characterAppearance,
                    connections: characterConnections,
                    isNpc: true,
                });
                console.log(`\u001b[1;32mCREATED: ${characterName}, the ${characterRace} ${characterClass}\u001b[0m`);
                console.groupEnd(`${characterName}`);
            } catch (error) {
                console.log("Error:", error);
                console.log(`ERROR AT: ${characterName}, the ${characterRace} ${characterClass}(${characterSubclass}) `);
                console.groupEnd(`${characterName}`);
            }
        }
    }
    console.groupEnd(`${characterClass} ${characterRace}s`);
}

await fs.writeFile("./backup.json", "{}");
