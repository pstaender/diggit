# Diggit
## Generates git commands from natural language

### Install

```sh
$ npm install -g diggit
```

Set your api key as (global) `OPENAI_API_KEY`-env-variable.

### Usage

```sh
$ diggit - Generate git command from sentence
```

```sh
$ diggit -- Generate git command from sentence but also sends relevant filenames as context
```

### Examples

```sh
$ diggit - Unstage the file docker-compose.yml
git reset HEAD docker-compose.yml
```

```sh
$ diggit - Add and commit lines of the file docker-compose.yml interactively
git add -p docker-compose.yml && git commit
```

Use your project files for context, to generate more project specific prompts:

```sh
$ diggit -- Add and commit all models
git add app/models && git commit
```

### yolo

If you have nothing to lose, feel free to execute the command directly and accept the potential consequences:

```sh
$ diggit - Your potential good prompt for the git command|sh
```

### License

MIT
