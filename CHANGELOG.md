# Changelog
- **Added** - For any new features that have been added since the last version was released
- **Changed** - To note any changes to the software's existing functionality
- **Deprecated** - To note any features that were once stable but are no longer and have thus been removed
- **Fixed** - Any bugs or errors that have been fixed should be so noted
- **Removed** - This notes any features that have been deleted and removed from the software
- **Security** - This acts as an invitation to users who want to upgrade and avoid any software vulnerabilities


## 0.0.1-alpha.3
_Released 2024/10/03_

**Added:**

- A `CHANGELOG.md` file to track project changes.
- A `clean` script in `package.json`.
- Notes to `README.md` outlining the temporary workaround for launching scripts.
  - **NOTE:** This includes installing `@types/command-line-args` as a peer dev dependency.

**Changed:**

- Renamed status `MIGRATED` to `APPLIED` and `MIGRATION_FAILED` to `APPLY_FAILED`.
- Renamed the `Migration` Model property `dateMigrated` to `dateApplied`.
- Renamed `src/bin` to `src/scripts`.


## 0.0.1-alpha.2
_Released 2024/10/01_

**Changed:**

- NPM binaries to launch `ts-node` directly from CLI.


## 0.0.1-alpha.1
_Released 2024/09/30_

**Bugfixes:**

- Adds `.js` extension in NPM binaries.

**Dependency Updates:**

- Removes `mustache` dependency.


## 0.0.1-alpha.0
_Released 2024/09/30_

- Initial release
