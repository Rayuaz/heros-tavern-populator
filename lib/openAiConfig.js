import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import { delay } from "../utils.js";
import fs from "fs/promises";

const configuration = new Configuration({
    apiKey: dotenv.config().parsed.OPEN_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function generateCharacterPrompts(apiCallCount, characterRace, characterClass, isNpc, numberOfResults) {
    const classText = isNpc ? "Profession" : "Class";

    const systemPrompt = `The user will input a Race, and ${classText} for a medieval fantasy character. You must return an elevator pitch for a character that must contain a name and surname, race, Class, a physical quirk or personality quirk, where they come from, their objective, and a something about their background in no particular order. Should fit in a single sentence, no longer than 200 characters. Use they/them pronouns. The return format must start with the character's name and surname, followed by a comma. Do not explain your answer. Do not give names to places. Return ${numberOfResults} results.`;

    const userPrompt = `Race: ${characterRace} ${classText}: ${characterClass}`;

    console.log("Generating character prompts...");
    console.log(`Prompt: ${userPrompt}`);

    const params = {
        temperature: 1,
        presence_penalty: 1,
        frequency_penalty: 0.5,
    };

    return generateRequest(apiCallCount, systemPrompt, userPrompt, params);
}

export async function generateCharacterDetails(apiCallCount, category, characterPrompt, speech) {
    console.log(`Generating character ${category}...`);

    let systemPrompt;
    let params = {
        temperature: 1,
        presense_penalty: 0,
        frequency_penalty: 0,
    };

    switch (category) {
        case "speech":
            systemPrompt = `The user will send you a fantasy character. Create speech patterns this character and return a set of instructions that an ai language model can use to replicate that character's speech pattern. The answer should be no longer than 70 characters, don't introduce the character and don't explain your reasoning. Example: "Use elegant and graceful language, speak in a melodious and flowing tone, and use nature-related metaphors"`;
            params.temperature = 0.7;
            params.presense_penalty = 1;
            break;
        case "characteristics":
            systemPrompt = `The user will send you a medieval fantasy character. Generate their personality trait, ideal, bond and flaw, in the style of Dungeons & Dragons. Write in first person, as if you were the character, using these instructions: "${speech}". Return format for this query must be 
"Personality trait: <description>
Ideal: <description>
Bond: <description>
Flaw: <description>". Do not introduce yourself.`;
            params.temperature = 0.9;
            break;
        case "appearance":
            systemPrompt = `Create a description of the physical appearance of the character the user sends you. This description can include (but is not limited to) hair, eyes, skin, posture, height, build, clothing, accessories, speech pattern, accent, and distinguishing features, in no particular order. Write in first person, as if you were the character describing themself to a blind person in a tavern. Use these instructions to match the character speech: ${speech}. The description must have at most 3 sentences.`;
            break;
        case "connections":
            systemPrompt = `The user will send you a medieval fantasy character. Describe this character's connections. It may include parents, siblings, grandparents, cousins, spouse, friends, partners, boss, co-workers, etc. Write in first person, as if you were the character explaining to a person in a tavern, using these instructions: ${speech}. Do not introduce yourself. Each connection must include the name of the character, and a brief description of their relationship, in no more than one sentence. Return 3 relationships. Each relationship must start in a new line with the name of the character. Wrap character names with *. `;
            params.temperature = 0.9;
            break;

        default:
            break;
    }

    return generateRequest(apiCallCount, systemPrompt, characterPrompt, params);
}

async function generateRequest(apiCallCount, systemPrompt, userPrompt, params) {
    if (apiCallCount % 3 === 0) {
        console.log("\u001b[1;90mSleeping for a minute. ZzZZzzZz...\u001b[0m");
        await delay(60000);
    }

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            temperature: params.temperature,
            presence_penalty: params.presense_penalty,
            frequency_penalty: params.frequency_penalty,
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
        });

        const responseContent = response.data.choices[0].message.content;

        if (responseContent === undefined) {
            console.log("\u001b[1;90mAPI request returned undefined. Trying again...\u001b[0m");
            return await generateRequest(apiCallCount, systemPrompt, userPrompt, params);
        } else {
            return responseContent;
        }
    } catch (error) {
        if (error.response?.status === 429) {
            console.log("\u001b[1;90mAPI rate limit exceeded. Trying again in 30s...\u001b[0m");
            await delay(30000);
            return await generateRequest(apiCallCount, systemPrompt, userPrompt, params);
        } else {
            console.log(error);
            await fs.writeFile("../errorLog.json", JSON.stringify(error));
            return;
        }
    }
}
