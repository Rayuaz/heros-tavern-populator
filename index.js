import { characterVariables } from "./characterVariables.js";

const { names, classes, races, objectives, personalityQuirks, physicalQuirks, locations, adjectives } = characterVariables;

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};

console.log(`${names.random()}, a ${adjectives.random()} ${races.random()} ${classes.random()} from ${locations.random()}, ${physicalQuirks.random()}, who wants ${objectives.random()}, and ${personalityQuirks.random()}`);
console.log("");
console.log(`${names.random()}, a ${adjectives.random()} ${races.random()} ${classes.random()} from ${locations.random()}, ${physicalQuirks.random()}, who wants ${objectives.random()}, and ${personalityQuirks.random()}`);
console.log("");
console.log(`${names.random()}, a ${adjectives.random()} ${races.random()} ${classes.random()} from ${locations.random()}, ${physicalQuirks.random()}, who wants ${objectives.random()}, and ${personalityQuirks.random()}`);
console.log("");
console.log(`${names.random()}, a ${adjectives.random()} ${races.random()} ${classes.random()} from ${locations.random()}, ${physicalQuirks.random()}, who wants ${objectives.random()}, and ${personalityQuirks.random()}`);
