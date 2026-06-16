import re

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\app\\(app)\\classroom\\[id]\\settings\\SettingsClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add isEditing state
content = content.replace(
    "const [showTransferConfirm, setShowTransferConfirm] = useState(false)",
    "const [showTransferConfirm, setShowTransferConfirm] = useState(false)\n  const [isEditing, setIsEditing] = useState(false)"
)

# Update padding and Title
content = content.replace(
    '<div className="max-w-5xl mx-auto space-y-8 pb-24">',
    '<div className="max-w-5xl mx-auto space-y-8 pt-12 pb-24">'
)
content = content.replace(
    '<h1 className="text-3xl font-bold text-foreground">Configuration</h1>',
    '<h1 className="text-3xl font-bold text-foreground">Settings</h1>'
)

# Remove the fixed sticky footer
content = re.sub(
    r'\{/\* Global Actions Sticky Footer \*/\}.*?<div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border py-4 px-8 flex justify-end gap-4 z-40 pl-\[292px\]">.*?</div>',
    '',
    content,
    flags=re.DOTALL
)

# Insert the Edit / Cancel / Save buttons on top of Ownership card
edit_section = """
          {/* Edit Actions */}
          <section className="bg-transparent border border-border p-6 rounded-xl flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Classroom Setup</h2>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold transition-colors"
              >
                Edit Settings
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-border text-foreground/70 hover:bg-muted rounded-lg text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    await handleSave();
                    setIsEditing(false);
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-xs font-bold transition-colors shadow-md disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            )}
          </section>
"""

content = content.replace(
    '{/* Ownership Transfer (Mock) */}',
    edit_section + '\n          {/* Ownership Transfer (Mock) */}'
)

# Disable inputs when not editing
content = content.replace(
    '<input \n                    type="text" \n                    value={name}\n                    onChange={(e) => setName(e.target.value)}',
    '<input \n                    type="text" \n                    value={name}\n                    disabled={!isEditing}\n                    onChange={(e) => setName(e.target.value)}'
)
content = content.replace(
    '<textarea \n                    value={description}\n                    onChange={(e) => setDescription(e.target.value)}',
    '<textarea \n                    value={description}\n                    disabled={!isEditing}\n                    onChange={(e) => setDescription(e.target.value)}'
)
content = content.replace(
    'button onClick={addSkill} className="flex items-center gap-1 text-foreground/50 hover:text-foreground/80 text-[10px] font-bold tracking-widest uppercase transition-colors"',
    'button onClick={addSkill} disabled={!isEditing} className="flex items-center gap-1 text-foreground/50 hover:text-foreground/80 disabled:opacity-30 disabled:hover:text-foreground/50 text-[10px] font-bold tracking-widest uppercase transition-colors"'
)


with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\app\\(app)\\classroom\\[id]\\settings\\SettingsClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Settings updated successfully!")
