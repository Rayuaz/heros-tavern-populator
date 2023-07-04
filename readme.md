# Hero's Tavern Populator

This is a tool to populate the database for [Hero's Tavern](https://github.com/Rayuaz/heros-tavern). It uses Open AI's API to generate new charatcers and add them to the database. It also has a script to rename characters, since GPT 3.5 has a tendency to use copyrighted character names.

## Usage

First, you'll need to setup PocketBase, as described in the [Hero's Tavern documentation](https://github.com/Rayuaz/heros-tavern), and add your admin user details to your .env file.

### Populator

You can run the populator by using:

```
node index.js
```

This script will use the prompts in `lib/openAiConfig.js` to generate a number of characters for each combination of race and class described in `config.js`. In case the script breaks, the data of the last character will be saved to `backup.json`, so when you run the script again, it will resume from where it stopped.

In the `config.js` file, you can edit the classes and races to be used, as well as the number of characters to be generated for each combination.

### Renamer

You can run the renamer by using:

```
node ./utils/renamer.js
```

This script is a search and replace for the entire database. To use it, just change the variables `search` and `replace`, at the top of the code, and run the script.

## Environment variables

`OPEN_API_KEY`: Your Open API key. This will be used to generate the characters.
`POCKETBASE_URL`: The pocketbase API URL. This will be used to access the database.
`POCKETBASE_EMAIL`: The pocketbase API Admin email. This will be used to access the database.
`POCKETBASE_PASWORD`: The pocketbase API Admin password. This will be used to access the database.
