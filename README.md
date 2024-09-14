# Creating Web Components in Angular 18 with Angular Elements

Web components offer a powerful way to build reusable components that work seamlessly across different frameworks and
libraries. With Angular, you can create these components using Angular Elements, which allows you to package Angular
components as custom elements.

In this article, we’ll walk through the steps to create a web component in Angular. You can find the full source
code in the [GitHub Repository](https://github.com/YuliaGaliulina/angular-elements-example).

## Prerequisites

Before we begin, let’s assume:

1. You already have an Angular component that you want to convert into an Angular element.
2. The main purpose of your app is to produce a web component (if not, some adjustments will be needed).

## Getting Started

### Step 1: Converting an Angular Component to a Web Component

To turn a component into a web component, we’ll use Angular Elements. In terminal, move to the root of your project 
and install the angular elements package:

```bash
npm install @angular/elements
```

Next, update the `main.ts` file to register your custom element:

```typescript
import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { LikeButtonComponent } from './like-button/like-button.component';
import 'zone.js';

createApplication()
    .then((app) => {
        const LikeButton = createCustomElement(LikeButtonComponent, { injector: app.injector });
        customElements.define('like-button', LikeButton);
    })
    .catch((err) => console.error(err));
```

> **Note:**
> This approach assumes your Angular app's primary purpose is to create a web component. In this case, you can
> simplify your project by removing the AppComponent, which typically serves as the main entry point for Angular
> applications. This eliminates the need to bootstrap AppComponent in main.ts, simplifying your setup.

#### Now, let's examine the component registration:

- `createApplication` creates an instance of an Angular application without bootstrapping components.
- `createCustomElement` converts `LikeButtonComponent` into a web component using Angular’s injector for dependency
  injection.
- `customElements.define` registers the Angular component as a web component, allowing it to be used as a standard HTML
  element (e.g., `<like-button>`).
- Make sure to import all necessary polyfills in the main.ts file. In this example we imported `zone.js`.

### Step 2: Testing the component in the development mode

Use an `index.html` file to host your web component:

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>LikeButton</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            height: 100vh;
            width: 100vw;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
        }
    </style>
</head>
<body>
    <!-- our custom component -->
    <like-button></like-button>
</body>
</html>

```

### Step 3: Preparing the production bundle

When preparing our web component for production, we need to consider how it will be distributed and used. By packaging
our web component into a single JavaScript file, we simplify deployment and ensure consistent functionality across
different web environments. Our goal is to generate a `main.js` file that contains all the necessary code for our
component to work independently.

In older Angular versions you would use `ngx-build-plus` package or a custom webpack configuration to produce a single
script. With the introduction of a new build system in Angular 17+ you no longer need this overhead and can simply
import the required dependencies in your main.ts file (like we did with polyfills). That's it!

However, we still need to tweak our angular.json file a bit, let's take a closer look:

```json
{
  "build": {
    "builder": "@angular-devkit/build-angular:application",
    "options": {
      "outputPath": "dist/like-button",
      "browser": "src/main.ts",
      "tsConfig": "tsconfig.app.json",
      "inlineStyleLanguage": "scss",
      "extractLicenses": false
    },
    "configurations": {
      "production": {
        "budgets": [
          ...
        ],
        "index": false
      },
      "development": {
        "optimization": false,
        "sourceMap": true,
        "index": "src/index.html"
      }
    }
  }
```

#### Let's break it down:

- In the build section, make sure the builder is set to `"@angular-devkit/build-angular:application"`, normally this 
  is a default builder.


- General builder options:
    - **Remove the `polyfills` option; if your project uses polyfills, import them in the main.ts file instead.**
    - Remove the `index` option; we'll configure this option for development and production separately. `// optional`

- Production Configuration:
    - **Delete the line `"outputHashing": "all"`. This will keep the bundled file names the same every time you 
      build the project without adding hashes to names.**
    - Set `index` to false; this prevents index.html file from being processed or copied to the output directory
      during the build. `// optional`
    - `extractLicenses` is set to false to avoid extracting into a separate file. `// optional`

- Development Configuration:
    - add `"index": "src/index.html"` here, as we still need it in dev mode. `// optional`

For detailed information on builder options in the angular.json file, visit
the [Browser Target Options Documentation.](https://yuliagaliulina.github.io/angular-cli-builders/docs/v18/browser)

### Step 4: Using the Web Component in production

Build your app with the following command:

```bash
ng build
```

This will produce a single JS file in `dist/your-app-name` folder. To use your web component, include this script in any
HTML file:

```html
<!doctype html>
<html lang="en">
<head>
    <!--  your meta tags and scripts  -->
    <!--  your web component script  -->
    <script src="path-to-your-component/main.js" type="text/javascript" defer></script>
</head>
<body>
    <like-button></like-button>
</body>
</html>
```

## Conclusion

Angular Elements makes it easy to create web components that encapsulate Angular functionality, allowing them to be used
in any web environment. By following the steps outlined in this article you can build
powerful, reusable components that work across frameworks and platforms.