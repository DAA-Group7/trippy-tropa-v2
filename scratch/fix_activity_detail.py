import re

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\app\\(app)\\classroom\\[id]\\activity\\[activityId]\\ActivityDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    r'bg-\[rgba\(18,18,42,0\.7\)\]': 'bg-card',
    r'border-white/10': 'border-border',
    r'text-\[\#e5e0ed\]': 'text-foreground',
    r'text-\[\#c6bfff\]': 'text-primary',
    r'from-primary-container to-secondary text-foreground': 'from-primary to-secondary text-primary-foreground',
    r'from-primary-container to-secondary flex': 'from-primary/20 to-secondary/20 flex', # The icon box
    r'text-foreground font-semibold">': 'text-foreground font-bold">',
    r'shadow-\[0_0_40px_rgba\(70,234,229,0\.25\)\]': 'shadow-xl shadow-secondary/20',
}

for pattern, repl in replacements.items():
    content = re.sub(pattern, repl, content)

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\app\\(app)\\classroom\\[id]\\activity\\[activityId]\\ActivityDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("ActivityDetailClient fixed for light mode!")
