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
```

```sh
$ diggit - Add lines of the file docker-compose.yml interactively
```

### YOLO mode

```sh
$ diggit --yolo - Add lines of the file docker-compose.yml interactively
```

or

```sh
$ diggit - Add lines of the file docker-compose.yml interactively|sh
```

### License

MIT
