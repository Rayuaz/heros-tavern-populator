/*
I have organized races and classes in groups, so that it'a little more organized,
and so that I can generate characters in "chunks". I select which groups I want to
use by assigning them to the variables `races` and `classes`, which are exported 
at the end of this file. 

You can also edit the number of characters per combination by changing the value of
`numberOfResults` at the end of this file.
*/

const commonClasses = [
    "Barbarian",
    "Bard",
    "Cleric",
    "Druid",
    "Fighter",
    "Monk",
    "Paladin",
    "Ranger",
    "Rogue",
    "Sorcerer",
    "Warlock",
    "Wizard",
    "Artificer",
];
const pathfinderClasses = [
    "Alchemist",
    "Investigator",
    "Magus",
    "Oracle",
    "Psychic",
    "Summoner",
    "Swashbuckler",
    "Thaumaturge",
    "Gunslinger",
];
const professions = [
    "Merchant",
    "Blacksmith",
    "Armorer",
    "Bowyer",
    "Herbalist",
    "Jester",
    "Local Wizard",
    "Innkeeper",
    "Stable Master",
    "Carpenter",
    "Lumberjack",
    "Mason",
    "Leatherworker",
    "Tailor",
    "Miller",
    "Baker",
    "Cook",
    "Jeweler",
    "Librarian",
    "Astrologer",
    "Cartographer",
    "Sailor",
    "Fisherman",
    "Farmer",
    "Beekeeper",
    "Miner",
    "Mayor",
    "Noble",
    "Historian",
    "Butcher",
    "Guild Master",
    "Priest",
    "Banker",
    "Archaeologist",
    "Crime Boss",
];

const commonRaces = [
    "Dwarf",
    "Elf",
    "Gnome",
    "Halfling",
    "Human",
    "Goblin",
    "Kenku",
    "Kobold",
    "Hobgoblin",
    "Lizardfolk",
    "Orc",
    "Catfolk",
    "Warforged",
];
const pathfinderRaces = [
    "Azarketi",
    "Leshy",
    "Fetchling",
    "Gnoll",
    "Grippli",
    "Kitsune",
    "Nagaji",
    "Ratfolk",
    "Vanara",
];
const dndRaces = [
    "Goliath",
    "Half-Elf",
    "Half-Orc",
    "Dragonborn",
    "Aarakocra",
    "Tortle",
    "Aasimar",
    "Firbolg",
    "Genasi (water, fire, earth or air)",
    "Bugbear",
    "Fairy",
    "Satyr",
    "Tiefling",
];

export const races = commonRaces;
export const classes = commonClasses;
export const numberOfResults = 3;
