# TechsolutionsFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources


```
techsolutions-frontend
├─ .angular
├─ .editorconfig
├─ angular.json
├─ package-lock.json
├─ package.json
├─ public
│  ├─ favicon-96x96.png
│  └─ img
│     ├─ cover5.jpg
│     ├─ Logo.png
│     ├─ nosotros.png
│     └─ social
│        └─ facebook.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ app.component.html
│  │  ├─ app.component.scss
│  │  ├─ app.component.ts
│  │  ├─ app.config.server.ts
│  │  ├─ app.config.ts
│  │  ├─ app.routes.server.ts
│  │  ├─ app.routes.ts
│  │  ├─ core
│  │  │  ├─ facades
│  │  │  ├─ guards
│  │  │  │  └─ auth.guard.ts
│  │  │  ├─ interceptors
│  │  │  │  ├─ auth.interceptor.spec.ts
│  │  │  │  └─ auth.interceptor.ts
│  │  │  ├─ layouts
│  │  │  │  └─ public-layout
│  │  │  │     ├─ public-layout.component.html
│  │  │  │     ├─ public-layout.component.scss
│  │  │  │     └─ public-layout.component.ts
│  │  │  ├─ models
│  │  │  │  └─ dashboard.model.ts
│  │  │  └─ services
│  │  │     ├─ auth.service.ts
│  │  │     ├─ client-portal.service.ts
│  │  │     ├─ client.service.ts
│  │  │     ├─ dashboard.service.ts
│  │  │     ├─ payment.service.ts
│  │  │     ├─ project.service.ts
│  │  │     ├─ service.service.ts
│  │  │     └─ user.service.ts
│  │  ├─ features
│  │  │  ├─ admin
│  │  │  │  ├─ admin.routes.ts
│  │  │  │  ├─ clients
│  │  │  │  │  ├─ client-form
│  │  │  │  │  │  ├─ client-form.component.html
│  │  │  │  │  │  ├─ client-form.component.scss
│  │  │  │  │  │  ├─ client-form.component.spec.ts
│  │  │  │  │  │  └─ client-form.component.ts
│  │  │  │  │  └─ client-list
│  │  │  │  │     ├─ client-list.component.html
│  │  │  │  │     ├─ client-list.component.scss
│  │  │  │  │     ├─ client-list.component.spec.ts
│  │  │  │  │     └─ client-list.component.ts
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ dashboard.component.html
│  │  │  │  │  ├─ dashboard.component.scss
│  │  │  │  │  └─ dashboard.component.ts
│  │  │  │  ├─ payments
│  │  │  │  │  ├─ payment-form
│  │  │  │  │  │  ├─ payment-form.component.html
│  │  │  │  │  │  ├─ payment-form.component.scss
│  │  │  │  │  │  └─ payment-form.component.ts
│  │  │  │  │  └─ payment-list
│  │  │  │  │     ├─ payment-list.component.html
│  │  │  │  │     ├─ payment-list.component.scss
│  │  │  │  │     └─ payment-list.component.ts
│  │  │  │  ├─ projects
│  │  │  │  │  ├─ project-form
│  │  │  │  │  │  ├─ project-form.component.html
│  │  │  │  │  │  ├─ project-form.component.scss
│  │  │  │  │  │  ├─ project-form.component.spec.ts
│  │  │  │  │  │  └─ project-form.component.ts
│  │  │  │  │  └─ project-list
│  │  │  │  │     ├─ project-list.component.html
│  │  │  │  │     ├─ project-list.component.scss
│  │  │  │  │     ├─ project-list.component.spec.ts
│  │  │  │  │     └─ project-list.component.ts
│  │  │  │  ├─ services
│  │  │  │  │  ├─ service-form
│  │  │  │  │  │  ├─ service-form.component.html
│  │  │  │  │  │  ├─ service-form.component.scss
│  │  │  │  │  │  └─ service-form.component.ts
│  │  │  │  │  └─ service-list
│  │  │  │  │     ├─ service-list.component.html
│  │  │  │  │     ├─ service-list.component.scss
│  │  │  │  │     └─ service-list.component.ts
│  │  │  │  └─ users
│  │  │  │     ├─ user-form
│  │  │  │     │  ├─ user-form.component.html
│  │  │  │     │  ├─ user-form.component.scss
│  │  │  │     │  ├─ user-form.component.spec.ts
│  │  │  │     │  └─ user-form.component.ts
│  │  │  │     └─ user-list
│  │  │  │        ├─ user-list.component.html
│  │  │  │        ├─ user-list.component.scss
│  │  │  │        ├─ user-list.component.spec.ts
│  │  │  │        └─ user-list.component.ts
│  │  │  ├─ auth
│  │  │  │  └─ login
│  │  │  │     ├─ login.component.html
│  │  │  │     ├─ login.component.scss
│  │  │  │     ├─ login.component.spec.ts
│  │  │  │     └─ login.component.ts
│  │  │  ├─ client
│  │  │  │  ├─ client.routes.ts
│  │  │  │  └─ portal
│  │  │  │     ├─ portal.component.html
│  │  │  │     ├─ portal.component.scss
│  │  │  │     └─ portal.component.ts
│  │  │  └─ public
│  │  │     └─ home
│  │  │        ├─ home.component.html
│  │  │        ├─ home.component.scss
│  │  │        └─ home.component.ts
│  │  └─ shared
│  │     ├─ components
│  │     │  ├─ layout
│  │     │  │  ├─ layout.component.html
│  │     │  │  ├─ layout.component.scss
│  │     │  │  └─ layout.component.ts
│  │     │  └─ ui
│  │     │     ├─ container-scroll
│  │     │     │  ├─ container-scroll.component.html
│  │     │     │  ├─ container-scroll.component.scss
│  │     │     │  └─ container-scroll.component.ts
│  │     │     ├─ data-table
│  │     │     │  ├─ data-table.component.html
│  │     │     │  ├─ data-table.component.scss
│  │     │     │  └─ data-table.component.ts
│  │     │     ├─ interactive-menu
│  │     │     │  ├─ interactive-menu.component.html
│  │     │     │  ├─ interactive-menu.component.scss
│  │     │     │  └─ interactive-menu.component.ts
│  │     │     └─ metric-card
│  │     │        ├─ metric-card.component.html
│  │     │        ├─ metric-card.component.scss
│  │     │        └─ metric-card.component.ts
│  │     ├─ directives
│  │     ├─ material
│  │     └─ pipes
│  ├─ environments
│  │  ├─ environment.development.ts
│  │  └─ environment.ts
│  ├─ index.html
│  ├─ main.server.ts
│  ├─ main.ts
│  ├─ server.ts
│  └─ styles.scss
├─ tailwind.config.js
├─ tsconfig.app.json
├─ tsconfig.json
└─ tsconfig.spec.json

```