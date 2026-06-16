The official Solarized Light color scheme, designed by Ethan Schoonover, is a precise 16-color palette divided into 8 monotones and 8 accent colors. [1, 2] 
In Light Mode, the scale of monotones is inverted: the brightest values are used for backgrounds, while the darkest values are utilized for text, headers, and UI framing. [3, 4] 
## 🧱 Monotones (Backgrounds & Text)

| Element [1, 3, 5, 6, 7] | Color Name | Hex Code | Visual Use |
|---|---|---|---|
| Primary Background | Base3 | #FDF6E3 | Main canvas background (creamy off-white) |
| Secondary Background | Base2 | #EEE8D5 | Subtle background highlights, list rows, code blocks |
| Subtle Text / Borders | Base1 | #93A1A1 | Placeholders, borders, and disabled states |
| Comments / Subtitles | Base0 | #839496 | Code comments and low-emphasis text labels |
| Body Text | Base00 | #657B83 | Primary body text copy (very soft contrast) |
| Content Emphasis | Base01 | #586E75 | Darker body text, active state indicators |
| Headers / Titles | Base02 | #073642 | Bold headers, titles, and structural frames |
| Max Focus UI | Base03 | #002B36 | Deepest contrast accents or temporary dark mode toggle |

------------------------------
## 🎨 Accent Hues (Syntax & Semantics)
The 8 accent colors maintain identical CIELAB lightness relationships so that they behave identically and legibly against either the light or dark backgrounds. [2, 4] 

* 🟦 Blue: #268BD2 — Secondary links / variables
* 🟩 Green: #859900 — Strings / successful operations
* 🟨 Yellow: #B58900 — Main functions / warnings
* 🟧 Orange: #CB4B16 — Constants / secondary actions
* 🟥 Red: #DC322F — Regex keywords / error states
* 🟪 Magenta: #D33682 — Built-in variables / key values
* 🔮 Violet: #6C71C4 — Key control flow words (e.g., if, return)
* 🌐 Cyan: #2AA198 — Numbers / regular expressions [3, 8, 9, 10, 11] 

------------------------------
## 🛠️ Implementing with CSS Variables
You can copy this standard setup directly into your web project stylesheets:

:root {
  /* Backgrounds & Text */
  --solarized-bg-primary: #fdf6e3;
  --solarized-bg-secondary: #eee8d5;
  --solarized-text-muted: #93a1a1;
  --solarized-text-body: #657b83;
  --solarized-text-header: #073642;

  /* Accents */
  --solarized-blue: #268bd2;
  --solarized-green: #859900;
  --solarized-yellow: #b58900;
  --solarized-orange: #cb4b16;
  --solarized-red: #dc322f;
  --solarized-magenta: #d33682;
  --solarized-violet: #6c71c4;
  --solarized-cyan: #2aa198;
}

body {
  background-color: var(--solarized-bg-primary);
  color: var(--solarized-text-body);
}

h1, h2, h3 {
  color: var(--solarized-text-header);
}