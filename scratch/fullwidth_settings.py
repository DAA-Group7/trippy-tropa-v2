import re

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\app\\(app)\\classroom\\[id]\\settings\\SettingsClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Extract the Top Actions
top_actions_match = re.search(r'\{/\* Top Actions \*/\}.*?<div className="flex items-center justify-end gap-3 mb-2">(.*?)</div>\s*\{/\* General Settings \*/\}', content, re.DOTALL)
if not top_actions_match:
    print("Could not find Top Actions")
top_actions_inner = top_actions_match.group(1).strip()

# 2. Modify Hero Header Section to include top actions
hero_replacement = f"""      {{/* Hero Header Section */}}
      <section className="flex items-start justify-between mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-foreground/70">Define the architectural parameters and skill weights for your virtual environment.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {top_actions_inner}
        </div>
      </section>
"""
content = re.sub(
    r'\{/\* Hero Header Section \*/\}.*?<section className="flex flex-col gap-1 mb-8">.*?</section>',
    hero_replacement,
    content,
    flags=re.DOTALL
)

# 3. Remove the Top Actions from its old place
content = re.sub(
    r'\{/\* Top Actions \*/\}.*?<div className="flex items-center justify-end gap-3 mb-2">.*?</div>\s*(?=\{/\* General Settings \*/\})',
    '',
    content,
    flags=re.DOTALL
)

# 4. Remove Grid wrapper
content = content.replace('<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">', '')
content = content.replace('{/* LEFT COLUMN */}', '')
content = content.replace('<div className="lg:col-span-8 space-y-8">', '<div className="space-y-8">')

# 5. Remove right column wrapper, moving its contents out
content = content.replace('{/* RIGHT COLUMN */}', '')
content = content.replace('<div className="lg:col-span-4 space-y-8">', '')

# Remove empty lines left over
content = re.sub(r'</div>\{/\* end right column \*/\}', '', content)
content = re.sub(r'</div>\{/\* end grid \*/\}', '', content)

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\app\\(app)\\classroom\\[id]\\settings\\SettingsClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Settings layout expanded to full width and header updated!")
