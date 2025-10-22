# Angul-It

## Overview

**Angul-It** is a multi-stage CAPTCHA web application built using **Angular**.  
It challenges users with interactive tasks such as selecting specific images, solving math problems, and typing text to verify that they are human.  
The app features persistent progress tracking, smooth transitions, and a final results page summarizing performance.

---

## Objectives

- Build a multi-stage CAPTCHA experience with Angular.
- Implement form validation for each challenge stage.
- Manage user progress using Angular state and browser storage.
- Display a result summary after successful completion.
- Prevent direct access to results without finishing all challenges.

---

## Tech Stack

- **Frontend:** Angular (latest version)
- **State Management:** Angular Services + LocalStorage
- **Styling:** SCSS or TailwindCSS (optional)
- **Routing:** Angular Router
- **Testing:** Jasmine & Karma (Angular default)

---

## Setup & Installation

1. **Create the Angular app**
   ```
   bash
   ng new angul-it
   cd angul-it
   ```

2. **Generate requiered components**
    ```
    bash
    ng generate component components/home
    ng generate component components/captcha
    ng generate component components/result
    ```

3. **Add routing support**
    ```
    ng generate module app-routing --flat --module=app
    ```

4. **Install dependencies(optional)**
    ```
    bash
    npm install @angular/animations
    npm install bootstrap
    ```

5. **Run the application**
    ```
    bash

    ng serve
    ```
    Visit http://localhost:4200/ in your browser

## Suggested File Structure
```
angul-it/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.component.html
│   │   │   │   ├── home.component.scss
│   │   │   ├── captcha/
│   │   │   │   ├── captcha.component.ts
│   │   │   │   ├── captcha.component.html
│   │   │   │   ├── captcha.component.scss
│   │   │   ├── result/
│   │   │   │   ├── result.component.ts
│   │   │   │   ├── result.component.html
│   │   │   │   ├── result.component.scss
│   │   ├── services/
│   │   │   ├── state.service.ts
│   │   │   ├── challenge.service.ts
│   │   ├── models/
│   │   │   ├── challenge.model.ts
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   ├── assets/
│   │   ├── images/
│   │   │   ├── cars/
│   │   │   ├── animals/
│   │   ├── data/
│   │   │   ├── challenges.json
│   ├── styles.scss
│
├── README.md
├── package.json
```
