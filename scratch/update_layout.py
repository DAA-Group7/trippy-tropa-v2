import re

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\app\\(app)\\classroom\\[id]\\settings\\SettingsClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add isDeleteDialogOpen state
content = content.replace(
    "const [isEditing, setIsEditing] = useState(false)",
    "const [isEditing, setIsEditing] = useState(false)\n  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)"
)

# Remove Edit Actions, Ownership Mock, and Danger Zone from right column
# Remove Edit Actions
content = re.sub(
    r'\{/\* Edit Actions \*/\}.*?<section className="flex items-center justify-end mb-4">.*?</section>',
    '',
    content,
    flags=re.DOTALL
)

# Remove Ownership Mock
content = re.sub(
    r'\{/\* Ownership Transfer \(Mock\) \*/\}.*?<section className="bg-transparent border border-border p-6 rounded-xl">.*?</section>',
    '',
    content,
    flags=re.DOTALL
)

# Remove Danger Zone
content = re.sub(
    r'\{/\* Danger Zone \*/\}.*?<section className="bg-transparent border border-border p-6 rounded-xl">.*?</section>',
    '',
    content,
    flags=re.DOTALL
)

# Put Edit Actions and Delete on top of General Setting
new_actions = """          {/* Top Actions */}
          <div className="flex items-center justify-end gap-3 mb-2">
            <button 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="px-4 py-2 border border-destructive/30 text-destructive hover:bg-destructive/10 rounded-lg text-xs font-bold transition-colors"
            >
              Delete Classroom
            </button>
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
          </div>
"""

content = content.replace(
    '{/* General Settings */}',
    new_actions + '\n          {/* General Settings */}'
)

# Add Modal
modal_code = """
      {/* Delete Confirmation Modal */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <h2 className="text-xl font-bold text-foreground">Danger Zone</h2>
            </div>
            <p className="text-sm text-foreground/70 mb-8">
              Once deleted, all classroom data, student progress logs, and collaborative assets will be permanently purged.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 border border-border text-foreground/70 hover:bg-muted rounded-lg text-sm font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert('Classroom deleted!');
                  setIsDeleteDialogOpen(false);
                }}
                className="px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg text-sm font-bold transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
"""

content = re.sub(r'    </div>\s*\)\s*}\s*$', modal_code, content)

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\app\\(app)\\classroom\\[id]\\settings\\SettingsClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Settings Layout!")
