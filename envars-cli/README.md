# Envars CLI

`envars` is a tool to set Environment Variables using a JSON database file.

The command line tool reads `ENVARS_JSON_PATH` and sets the variables for a project whose name is equal to the current directory.

## Database of variables (e.g. envars.json)

The path of the database file must be specified by an environment variable named `ENVARS_JSON_PATH`.

```json
{
  "myapp": {
    "dev": {
      "APP_NAME": "my application 😄",
      "EMPTY_VAR": ""
    },
    "prod": {
      "APP_NAME": "my application 😄 [production]",
      "EMPTY_VAR": "<must-not-be-empty>"
    }
  }
}
```

## Dependencies

- chalk — colorizes the output
- clui — draws command-line tables, gauges and spinners
- figlet — creates ASCII art from text
- inquirer — creates interactive command-line user interface
- minimist — parses argument options
- configstore — easily loads and saves config without you having to think about where and how.
