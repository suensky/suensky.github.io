## Hugo Setup

### Install Hugo
Make sure Hugo is installed. If not, you can install it using Homebrew:

```bash
brew install hugo
```

### Initialize Submodules
Ensure the PaperMod theme is initialized:

```bash
git submodule update --init --recursive
```

### Running the Site Locally
To start a local development server:

```bash
hugo server -D
```

### Building the Site
To generate the static files:

```bash
hugo
```

### Creating New Content
To create a new post:

```bash
hugo new content/posts/your-post-title.md
```

### Updating the Theme
To update the PaperMod theme:

```bash
git submodule update --remote --merge
```
