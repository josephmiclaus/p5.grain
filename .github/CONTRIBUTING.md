# Contributing

First off, we greatly appreciate you for considering contributing to p5.grain! 🙌

Although p5.grain can already be used for p5.js sketches in production, it's still in the initial development stage and there are quite a few ways in which you can contribute. Here you can find our guidelines for contributing.

* [Code of Conduct](#code-of-conduct)
* [Support Questions](#support-questions)
* [Issues and Bugs](#issues-and-bugs)
* [Feature Requests](#feature-requests)
* [Pull Requests](#pull-requests)
* [Coding Guidelines](#coding-guidelines)
* [Commit Message Guidelines](#commit-message-guidelines)
* [Licensing](#licensing)
* [Roadmap](#roadmap)

## Code of Conduct

Let's keep p5.grain open and inclusive. Please read and follow our [Code of Conduct](./.github/CODE_OF_CONDUCT.md).

## Support Questions

For general support questions, [start a discussion](./discussions/new?category=q-a) in the Q&A category in Discussions.

## Issues and Bugs

If you find a bug in the source code or a mistake in the documentation, you can help by [submitting an issue](./issues/new).

Guidelines:

1. Make sure the issue has not already been reported; use the search for issues.
2. If possible, include a simple example demonstrating the issue (via [p5.js Web Editor](https://editor.p5js.org), [OpenProcessing](https://openprocessing.org/sketch/create), [CodePen](https://codepen.io/pen), etc.) using the latest p5.grain version.
3. You are welcome to create an accompanying Pull Request with a fix. Checkout the section on [Pull Requests](#pull-requests).

## Feature Requests

You can request a new feature by [starting a discussion](./discussions/new?category=ideas) in the Ideas category in Discussions.

Guidelines:

1. Make sure the feature has not already been requested; use the search for discussions.
2. You are welcome to create an accompanying Pull Request with your implementation, however, let us talk about it first in Discussions.

## Pull Requests

Pull Requests should be accompanied by an issue (for bugs and documentation mistakes) or a discussion (for patches, improvements, and feature requests) unless you're suggesting small changes.

Guidelines:

1. **Install system tools**
    * Any OS: `git`, `node >= 16.14.0`, `npm >= 8.3.0`
    * macOS: `sed`, `xargs` (both should be preinstalled)
    * Windows: TBD, checkout [Roadmap](#roadmap)
2. **Fork, Clone, Configure remotes, Install dependencies**
    ```bash
    # Clone your fork of p5.grain
    git clone https://github.com/<your-username>/p5.grain
    # Navigate to the newly cloned directory
    cd p5.grain
    # Assign the original repository to a remote called upstream
    git remote add upstream https://github.com/meezwhite/p5.grain
    # Install dependencies
    npm i
    ```
3. **Get the latest changes from upstream** (Optional, but recommended)
    ```bash
    git checkout main
    git pull upstream main
    ```
4. **Create a new branch** to contain your changes. (Optional, but recommended)
    ```bash
    git checkout -b <topic-branch-name>
    ```
5. **Making changes**<br>
    * You'll want to make changes to `p5.grain.js` and test them against examples inside the `/examples` directory. However, changes you make to `p5.grain.js` won't be immediately available for the examples, as they are "standalone", meaning that they work independently, each using a local `p5.grain.core.js` version inside the `/lib` directory of the respective example. Therefore, you should either:
        * temporarily change the `index.html` of the respective example to use `p5.grain.js` or
        * run the npm build command for your OS to build and distribute a `p5.grain.core.js` version to every example which will include your changes.
            * macOS: `npm run build:darwin`
            * Windows: currently unavailable, checkout [Roadmap](#roadmap)
    * Encapsulate any code parts (e.g. errors and warnings for development purposes) that should not be part of the core version within `/** @internal */` and `/** @end */` markers. Everything encapsulated between these markers will be removed upon building p5.grain. Here is an example:
        ```js
        /** @internal */
        this.#validateArguments('setup', arguments); // <-- will NOT be part of p5.grain.core.js
        /** @end */
        this.#myPrivateFunction(); // <-- will be part of p5.grain.core.js
        ```
6. **Testing and examples**
    * If it makes sense (e.g. you added a new technique), create a standalone example inside the `/examples` directory.
       * If your technique supports cross-browser animation, enable it by default.
       * Use the existing examples as orientation for your example.<br>*NOTE: Examples only showcase the simplest implementation of a technique.*
    * Test all examples to see if they still work as expected in all major desktop and mobile browsers (especially Safari).
        * If you cannot test your changes in some browsers or platforms, mention this in the respective issue or discussion so that somebody else can check this.
    * If necessary, update existing examples to reflect your changes.
7. **Document changes**
    * Annotate your changes inside `p5.grain.js` following [JSDoc](https://jsdoc.app).
    * Update the `README.md` file to reflect your changes accordingly.
8. **Commit changes**
    * Before commiting your changes:
        * Run the npm build command for your OS to build and distribute a `p5.grain.core.js` version to every example.
            * macOS: `npm run build:darwin`
            * Windows: currently unavailable, checkout [Roadmap](#roadmap)
            <br>*NOTE: If your OS is not supported yet, mention this in your Pull Request.*
        * Optionally, you can use [git rebase](https://help.github.com/articles/about-git-rebase) to clean up your commit history before submitting a Pull Request on GitHub.
    * Commit your changes following our [Commit Message Guidelines](#commit-message-guidelines)
9. **Locally rebase (or merge) upstream changes** (Optional, but recommended)
   * **Recommended:** Update your branch to the latest changes in the upstream main branch
        ```bash
        git pull --rebase upstream main
        ```
    * Alternative: Merge your changes with upstream changes
        ```bash
        git pull upstream main
        ```
10. **Push changes to your fork**
    ```bash
    # If you rebased, you'll need to force push
    git push -f origin <topic-branch-name>

    # Otherwise
    git push origin <topic-branch-name>
    ```
11. **Open a Pull Request** to p5.grain main branch with a clear title and description. ([GitHub info about using Pull Requests](https://help.github.com/articles/using-pull-requests))

## Coding Guidelines

To the best of your ability, please follow [Airbnb's JavaScript Style Guide](https://github.com/airbnb/javascript).

## Commit Message Guidelines

Feel free to follow the guidelines below on how to construct your commit messages (based on [Angular's guidelines](https://github.com/angular/components/blob/272f50a139c39d676f5de36e346be60521f2779d/CONTRIBUTING.md#-commit-message-guidelines)).

But don't worry too much about them. 😌

```
<type>(<scope>): <subject>

<body>

<footer>
```
*NOTE: The `<scope>`, `<body>` and `<footer>` are optional.*

### Type

Should be one of the following:

* **feat**: Creates a new feature
* **fix**: Fixes a bug
* **docs**: Changes to documentation
* **test** or **example**: Adds, changes, improves example
* **refactor**: Refactor without any change in functionality or API
* **style**: Style changes (code formatting, missing semi-colons, white-spaces, etc.)
* **perf**: Improves performance without any change in functionality or API
* **build**: Changes to build system and tooling
* **chore**: Changes to meta files (e.g. *package.json*, *.gitignore*)

### Scope

Determine the scope using the following guidelines in order:

* If `<type>` is *style*, omit the scope.
* If `<type>` is *build*, `<scope>` should be either *darwin*, *win32* or *linux*
* If `<type>` is *docs* or *chore*, `<scope>` should be the name of the file (e.g. *README*, *package.json* or *.gitignore*)
* If changes are exclusive to a library function, use that function's name: *setup*, *granulateSimple*, *granulateChannels*, *granulateFuzzy*, *textureAnimate*, *textureOverlay*, *validateArguments*.
* If changes are exclusive to a technique or an example, use that technique's or example's name: *pixel-manipulation*, *shader*, *svg-element*, *svg-url-encoded*, *texture-overlay-inside*, *texture-overlay-outside*.
* Otherwise you may omit the scope.

*NOTE: If you omit `<scope>`, also omit the parentheses.*

### Subject

The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body

Just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes".

The body is the place to include the motivation for the change and contrast this with previous behavior.

### Footer

The footer is the place to mention **Breaking Changes** and reference GitHub issues that this commit tackles.

**Breaking Changes** should start with `BREAKING CHANGE:` followed by a space or two newlines. The rest of the commit message is then used for this.

**Referencing issues** should happen on the last line in the footer. You may reference multiple issues.

## Licensing

By making a contribution to p5.grain, you agree to license your work under the [MIT License](./LICENSE) and you agree to the Developer's Certificate of Origin 1.1, which you can find below or at https://developercertificate.org.

```
Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```

## Roadmap

* [ ] Implement JavaScript module syntax
* [ ] Add possibility to build only specified functions to core
* [ ] Add generalized `granulate` function
* [ ] Add possibility for custom `granulate` functions
* [ ] Add possibility to use shaders
* [ ] Add npm scripts for Windows
* [ ] Add npm scripts for Linux
* [ ] Change examples to use CSS classes instead of IDs
