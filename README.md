# Rescura

This project was generated using **[Bolt.new](https://bolt.new)**.

## Prompts Used

**Prompt 1**

```
Create a modern, minimalistic, and responsive frontend for Rescura, a Dutch emergency aid web application.

Core Philosophy:
- Simplicity first, no clutter
- Accessibility under stress
- Accuracy & speed

Global Features (always visible on every page):
- Call Emergency Services button
- Ambulance Arrived button
- Back button
- First Responder Mode Toggle (normal vs. detailed instructions)

Flowcharts:
- Categories: Hartaanval, Brandwonden, Hevige bloeding, Verstikking, Bewusteloos slachtoffer, Val van grote hoogte, Elektrocutie, Amputatie
- Each step: instruction text, supporting image, buttons for next steps
- Optional interactive body map branching

Reporting:
- Track every step the user follows with timestamp
- Detailed report for ambulance staff or doctors

Admin Panel:
- Login for admins
- Manage categories & flowcharts
- Add step instructions with text + image + branching logic
- Support for different text in normal vs. first responder mode

Design Guidelines:
- Colors: #016565 (teal green) and #C12F2F (deep red)
- Large readable typography
- Mobile-first, calm and professional
```

**Prompt 2**

```
I want you to build a flowchart engine where I can easily create new flowcharts with multiple steps starting from the category and also make it possible to reuse certain steps like waiting for an ambulance.
(Optional) If possible, also generate a visual flowchart of what was created to easily spot errors.
```

---

## Admin Login

* **Password:** `rescura2024`

---

## Running Locally

This is a **Vite app**. To run it locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
