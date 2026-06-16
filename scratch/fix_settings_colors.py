import re

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\app\\(app)\\classroom\\[id]\\settings\\SettingsClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    # Text colors
    r'text-\[\#e5e0ed\]': 'text-foreground',
    r'text-\[rgba\(200,196,215,0\.8\)\]': 'text-foreground/70',
    r'text-foreground/20': 'text-foreground/50',
    r'text-foreground/40': 'text-foreground/60',
    r'text-foreground/60': 'text-foreground/80',
    r'text-muted-foreground': 'text-foreground/70',
    r'text-on-surface-variant': 'text-foreground/70',
    r'text-on-surface': 'text-foreground',
    r'text-error': 'text-destructive',
    r'text-on-secondary': 'text-secondary-foreground',
    
    # Borders
    r'border-white/5': 'border-border',
    r'border-white/10': 'border-border/60',
    r'border-outline-variant': 'border-border',
    r'border-white/40': 'border-border',
    
    # Backgrounds
    r'bg-\[rgba\(14,13,21,0\.5\)\]': 'bg-input',
    r'hover:bg-white/5': 'hover:bg-muted',
    r'bg-surface/70': 'bg-card/70',
    r'bg-surface/80': 'bg-background/80',
    
    # Gradient button
    r'from-primary-container': 'from-primary',
    r'to-secondary-container': 'to-secondary',
    r'from-primary to-secondary text-foreground': 'from-primary to-secondary text-primary-foreground',
}

for pattern, repl in replacements.items():
    content = re.sub(pattern, repl, content)

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\app\\(app)\\classroom\\[id]\\settings\\SettingsClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("SettingsClient updated with correct light theme contrasts!")
