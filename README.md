# Diggit
## Generates git commands from natural language

### Install and Setup

```sh
$ npm install -g diggit
```

Choose your ai provider by [setting the config keys or environment variables](#configuration). By default a local running version of ollama is expected.

#### OpenAI Setup

Set your api key as (global) `OPENAI_API_KEY`-env-variable. The default model is `gpt-4o`.

#### Ollama

Install [oolama](https://ollama.com/) with llama3 (`ollama run llama3`).

#### Other models

For more models and configurations, see [Configuraion](#configuration).

### Usage and examples

```sh
$ diggit - Unstage the file docker-compose.yml
git reset HEAD docker-compose.yml
```

```sh
$ diggit - Add and commit lines of the file docker-compose.yml interactively
git add -p docker-compose.yml && git commit
```

```sh
$ diggit - Change last commit message
git commit --amend
```

Use your project files for context, to generate more project specific prompts:

```sh
$ diggit -- Add and commit all models
git add app/models && git commit
```

Generate short commit messages:

```sh
$ diggit --message - Refined html template for newsletter mailer to improve external user experience
Improve HTML template for newsletter mailer
```

To list available options:

```sh
$ diggit -h
```

### yolo

If you have nothing to lose, feel free to execute the command directly and accept the potential consequences:

```sh
$ diggit - Your potential dangerous prompt for the git command|sh
```

```sh
$ git commit -m "$(diggit -m - Generating a short commit message from a long text message)"
```

### Configuration

Create a `.diggit.json` in your home directory and set your desired config values.

Configurable values are:

```js
{
  "openai_key": "sk-…",             // or OPENAI_API_KEY
  "openai_model": "gpt-4-turbo",    // or OPENAI_API_MODEL
  "ollama_model": "mistral"         // or OLLAMA_MODEL
}
```

### License

MIT
