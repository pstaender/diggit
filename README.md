# Diggit
## Let ai generate your git commands

### Install

```sh
$ npm install -g diggit
```

Set your api secret as (global) `OPENAI_API_KEY`-env-variable.

### Usage

```sh
$ diggit - Your problem for what you need a git command
```

### Examples

```sh
$ diggit - Unstage the file docker-compose.yml
git reset HEAD docker-compose.yml
```

```sh
$ diggit - Add lines of the file docker-compose.yml interactively
git add -p docker-compose.yml
```

### ⚠️ yolo ⚠️

If you have nothing to lose, feel free to execute the command directly and accept the potential consequences:

```sh
$ diggit - Add lines of the file docker-compose.yml interactively|sh
```

### License

MIT
