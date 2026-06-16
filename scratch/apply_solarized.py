import re

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\app\\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    r'bg-\[\#faf8ff\]': 'bg-background',
    r'bg-\[\#faf8ff\]/80': 'bg-background/80',
    r'text-\[\#131b2e\]': 'text-foreground',
    r'text-\[\#131b2e\]-variant': 'text-muted-foreground',
    r'text-\[\#004ac6\]': 'text-primary',
    r'bg-\[\#004ac6\]': 'bg-primary',
    r'text-\[\#ffffff\]': 'text-primary-foreground',
    r'text-white': 'text-primary-foreground',
    r'border-white/30': 'border-border/30',
    r'bg-white': 'bg-card',
    r'bg-\[\#f2f3ff\]': 'bg-muted',
    r'bg-\[\#eaedff\]': 'bg-card',
    r'bg-\[\#dae2fd\]': 'bg-accent',
    r'text-\[\#434655\]': 'text-muted-foreground',
    r'border-\[\#c3c6d7\]': 'border-border',
    r'border-\[\#c3c6d7\]/30': 'border-border',
    r'border-\[\#c3c6d7\]/20': 'border-border',
    r'border-\[\#737686\]': 'border-border',
    r'border-\[\#737686\]-variant/30': 'border-border',
    r'bg-\[\#004ac6\]/10': 'bg-primary/10',
    r'bg-\[\#004ac6\]/5': 'bg-primary/5',
    r'bg-\[\#004ac6\]/20': 'bg-primary/20',
    r'text-\[\#004ac6\]/20': 'text-primary/20',
    r'text-\[\#b4c5ff\]': 'text-primary-foreground/80',
    r'bg-\[\#faf8ff\]-container': 'bg-card',
    r'bg-\[\#faf8ff\]-container-low': 'bg-muted',
    r'bg-\[\#faf8ff\]-container-highest': 'bg-accent',
    r'bg-\[\#006686\]/10': 'bg-secondary/10',
    r'text-\[\#006686\]': 'text-secondary',
    r'bg-\[\#ba1a1a\]/10': 'bg-destructive/10',
    r'text-\[\#ba1a1a\]': 'text-destructive',
    r'bg-\[\#525657\]/10': 'bg-muted',
    r'text-\[\#525657\]': 'text-muted-foreground',
    r'bg-\[radial-gradient\(circle_at_50%_50%,rgba\(37,99,235,0\.05\)_0%,transparent_50%\)\]': 'bg-[radial-gradient(circle_at_50%_50%,var(--primary)_0%,transparent_50%)]',
}

for pattern, repl in replacements.items():
    content = re.sub(pattern, repl, content)

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\app\\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied Solarized replacements!")
