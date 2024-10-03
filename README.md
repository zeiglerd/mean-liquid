# mean-liquid

Helps developers track, version, and deploy database changes.

Inspired by [Liquibase]; but, re-inventing the wheel – the one they asked us not to 😈 – for the MEAN stack.

#### _**NOTE:** The library is tied to [Mongoose] for now._


## Table of Contents
1. [Installation](#installation)
1. [Environment Setup](#environment-setup)
1. [Getting Started](#getting-started)
1. [Available Commands](#available-commands)
1. [Possible Statuses](#possible-statuses)
1. [Cites](#cites)


## Installation
_[Back to Top](#mean-liquid)_

Install `mean-liquid` as a dev dependency:
```bash
npm i -D mean-liquid @types/command-line-args
```

**NOTE:** Ideally the **Installation** would end here, and we would run `mean-liquid` using `npx`, for example: `npx db-status`; however, it seems that feature is still a work in progress... In the meantime, we'll need to run `mean-liquid` from the `node_modules` directory, like so:
- **db-create**: **$** `npx ts-node node_modules/mean-liquid/src/scripts/create.ts`
- **db-down**: **$** `npx ts-node node_modules/mean-liquid/src/scripts/down.ts`
- **db-status**: **$** `npx ts-node node_modules/mean-liquid/src/scripts/status.ts`
- **db-up**: **$** `npx ts-node node_modules/mean-liquid/src/scripts/up.ts`

It may be easier to add these scripts to your project `package.json`.

**NOTE:** The rest of this `README.md` assumes you have the below `scripts` in your `package.json`:
```json
    ...
    "scripts": {
        ...
        "db-create": "npx ts-node node_modules/mean-liquid/src/scripts/create.ts",
        "db-down": "npx ts-node node_modules/mean-liquid/src/scripts/down.ts",
        "db-status": "npx ts-node node_modules/mean-liquid/src/scripts/status.ts",
        "db-up": "npx ts-node node_modules/mean-liquid/src/scripts/up.ts"
    },
    ...
```
Afterwards, the same scripts could be started like so:
- **db-create**: **$** `npm run db-create`
- **db-down**: **$** `npm run db-down`
- **db-status**: **$** `npm run db-status`
- **db-up**: **$** `npm run db-up`

**NOTE:** The rest of this `README.md` assumes you have the above `scripts` in your `package.json`!

## Environment Setup
_[Back to Top](#mean-liquid)_

Create a `.env` file in your project root (where you've installed `mean-liquid`) with the following key/value pairs:
```env
DB_URI={{THIS SHOULD BE YOUR MONGODB DB_URI}}
MIGRATIONS_DIR=migrations
MIGRATIONS_LOG=migrations.log
```
Here's what mine looks like:
```env
DB_URI=mongodb://localhost:27017/development
MIGRATIONS_DIR=migrations
MIGRATIONS_LOG=migrations.log
```


## Getting Started
_[Back to Top](#mean-liquid)_

1. ### Start with the `db-create` executable to generate an empty migration file:
    - ```bash
        npm run db-create my-first-migration
        ```
        - The migration filename(s) are determined by concatenating the migration name with the migration `_id`.
            - Example: `my-first-migration-66fb2159031d1f0103efac7d.ts`
        - The migration file(s) will be generated in your project root under the `MIGRATIONS_DIR` directory.
            - Example: `./migrations/my-first-migration-66fb2159031d1f0103efac7d.ts`

                Here's an example of what a newly generated migration file looks like:
                ```ts
                // import or write Mongoose schemas and models here...

                export async function up() {
                    // write upgrade script here... throw Error or return false to fail upgrade.
                    return true;
                }

                export async function down() {
                    // write revert script here... throw Error or return false to fail revert.
                    return true;
                }
                ```

1. ### Using the generated migration file, and the [Mongoose] library, write an `up`-grade and a `down`-grade script.
    - Here's an example; but, you may want to import pre-existing schemas and models and/or interfaces and types:
        ```ts
        import mongoose, { Schema } from 'mongoose';

        const recipeSchema = new Schema({
          author: { type: String, required: true },
          title: { type: String, required: true },
        });

        const Recipe = mongoose.model('Recipe', recipeSchema);

        export async function up() {
          await Recipe.create({
            author: 'Dustin',
            title: 'Chicken Noodle Soup',
          });

          return true;
        }

        export async function down() {
          await Recipe.deleteOne({
            author: 'Dustin',
            title: 'Chicken Noodle Soup',
          });

          return true;
        }
        ```
    - _**NOTE:** At anytime during an `up`-grade or a `down`-grade, you can `throw` an `Error`; or, simply `return false`, to mark the `up`-grade or the `down`-grade as a failure, and set the status to `APPLY_FAILED` or `REVERT_FAILED` respectively._
    - _**NOTE:** While a `down`-grade script is not strictly mandatory it will make reverting changes significantly easier._

1. ### Now it's time to run the `db-up` executable:
    - ```bash
        npm run db-up my-first-migration
        ```

1. ### Then we can check the status of the migration is `APPLIED`:
    - First run the `db-status` executable:
        - ```bash
            npm run db-status my-first-migration
            ```
    - Then check the `CHANGELOG` collection in your database, to find the migration document, and ensure the `status` is `APPLIED`.

1. ### Now, if you created a `down`-grade script, run the revert with the `db-down` executable:
    - ```bash
        npm run db-down my-first-migration
        ```

1. ### Then we can check the status of the migration is `REVERTED`:
    - First run the `db-status` executable:
        - ```bash
            npm run db-status my-first-migration
            ```
    - Then check the `CHANGELOG` collection in your database, to find the migration document, and ensure the `status` is `REVERTED`.


## Available Commands
_[Back to Top](#mean-liquid)_

- ### `db-create`
    - **Description:** Creates migration(s) with the `status` set to `CREATED`.
    - **Example:**
        - ```bash
            npm run db-create my-first-migration my-second-migration
            ```

- ### `db-down`
    - **Description:** Reverts migration(s) with the `status` of `APPLIED` and updates the `status` to `REVERTED`.
    - **Flags:**
        - `all`: Reverts **ALL** migrations with the `status` of `APPLIED`.
        - `reset`: Makes migration(s) appear as if never applied, by unsetting the `dateApplied` and the `dateReverted`, and changing the `status` to `CREATED`.
            - _**NOTE:** _The `--reset` flag **can** be combined with the_ `--all` _flag._
    - **Example:**
        - Reverts specified migration(s):
            ```bash
            npm run db-down my-first-migration my-second-migration
            ```
        - Reverts specified migration(s) and makes them appear as if never applied:
            ```bash
            npm run db-down -- --reset my-first-migration my-second-migration
            ```
        - **WARNING:** This will attempt to revert **ALL** migrations with a `status` of `APPLIED`!!
            ```bash
            npm run db-down -- --all
            ```
            - Can be combined with the `--reset` flag:
                ```bash
                npm run db-down -- --reset --all
                ```

- ### `db-status`
    - **Description:** Lists migration(s) and their `status`.
    - **Example:**
        - List all migrations and their `status`:
            ```bash
            npm run db-status
            ```
        - List specified migration(s) and their `status`:
            ```bash
            npm run db-status my-first-migration my-second-migration
            ```

- ### `db-up`
    - **Description:** Applies migration(s) with the `status` of `CREATED` or `REVERTED` and updates the `status` to `APPLIED`.
    - **Flags:**
        - `all`: Applies **ALL** migrations with the `status` of `CREATED` or `REVERTED`.
        - `force`: Applies migration(s) regardless of thier `status`.
            - _**NOTE:** _The `--force` flag **cannot** be combined with the_ `--all` _flag._
    - **Example:**
        - Applies specified migration(s):
            ```bash
            npm run db-up my-first-migration my-second-migration
            ```
        - Applies specified migration(s) regardless of thier `status`:
            ```bash
            npm run db-up -- --force my-first-migration my-second-migration
            ```
        - **WARNING:** This will attempt to apply **ALL** migrations with a `status` of `CREATED` or `REVERTED`!!
            ```bash
            npm run db-up -- --all
            ```


## Possible Statuses
_[Back to Top](#mean-liquid)_

- `CREATED`
- `APPLIED`
- `APPLY_FAILED`
- `REVERTED`
- `REVERT_FAILED`


## Cites
_[Back to Top](#mean-liquid)_

- [Liquibase]
- [MongoDB]
- [Mongoose]

[Liquibase]: https://www.npmjs.com/package/liquibase
[MongoDB]: https://www.mongodb.com/
[Mongoose]: https://www.npmjs.com/package/mongoose
