import re

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\components\\activities\\GroupDraftBoard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    r'bg-\[rgba\(18,18,42,0\.95\)\] border-secondary/50 shadow-\[0_0_20px_rgba\(70,234,229,0\.3\)\]': 'bg-card border-secondary shadow-xl shadow-secondary/20',
    r'bg-white/5 border-white/10 hover:border-primary/30': 'bg-input border-border hover:border-primary/50',
    r'text-foreground/30 hover:text-foreground/60': 'text-foreground/40 hover:text-foreground',
    r'from-primary-container to-secondary flex items-center justify-center text-foreground': 'from-primary/20 to-secondary/20 flex items-center justify-center text-primary',
    r'bg-\[rgba\(18,18,42,0\.9\)\] border border-white/10': 'bg-card border border-border',
    r'bg-white/10 border border-white/20': 'bg-input border border-border',
    r'bg-white/5 rounded-full': 'bg-border/50 rounded-full',
    r'from-primary-container to-secondary rounded-full': 'from-primary to-secondary rounded-full',
    r'border-2 border-dashed border-white/10': 'border-2 border-dashed border-border text-foreground/40',
    r'bg-\[rgba\(18,18,42,0\.7\)\] border border-white/10': 'bg-card border border-border',
    r'text-white/60': 'text-foreground/60',
    r'text-white/40': 'text-foreground/40',
    r'from-primary-container/60 to-secondary/60': 'from-primary/60 to-secondary/60',
    r'border-t border-secondary/40': 'border-t border-secondary',
    r'bg-\[rgba\(10,10,26,0\.9\)\] backdrop-blur-xl border-t border-white/10': 'bg-background/90 backdrop-blur-xl border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.05)]',
    r'text-white/50': 'text-foreground/50',
    r'border border-white/10 text-white/60 hover:text-white hover:border-white/30': 'border border-border text-foreground/60 hover:text-foreground hover:bg-muted/50',
    r'from-primary-container to-secondary text-white': 'from-primary to-secondary text-primary-foreground',
}

for pattern, repl in replacements.items():
    content = re.sub(pattern, repl, content)

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\components\\activities\\GroupDraftBoard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("GroupDraftBoard fixed for light mode!")
