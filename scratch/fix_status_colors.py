import re

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\app\\(app)\\activities\\ActivitiesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace getStatusInfo
new_get_status = """function getStatusInfo(activity: Activity) {
  const { due_date } = activity

  if (!due_date) return { label: 'No Due Date', textColor: 'text-muted-foreground', bgClass: 'bg-muted/50', borderClass: 'border-border/50' }

  const due = new Date(due_date)
  const now = new Date()

  if (activity.isSubmitted) {
    return { label: 'Submitted', textColor: 'text-primary', bgClass: 'bg-primary/10', borderClass: 'border-primary/20' }
  }

  if (isPast(due)) {
    return { label: 'Overdue', textColor: 'text-destructive', bgClass: 'bg-destructive/10', borderClass: 'border-destructive/20' }
  }
  if (isToday(due)) {
    return { label: 'Due Today', textColor: 'text-orange-600 dark:text-orange-400', bgClass: 'bg-orange-500/10', borderClass: 'border-orange-500/20' }
  }
  if (isTomorrow(due)) {
    return { label: 'Due Tomorrow', textColor: 'text-amber-600 dark:text-amber-400', bgClass: 'bg-amber-500/10', borderClass: 'border-amber-500/20' }
  }
  const days = differenceInDays(due, now)
  if (days <= 7) {
    return { label: `${days}d left`, textColor: 'text-indigo-600 dark:text-indigo-400', bgClass: 'bg-indigo-500/10', borderClass: 'border-indigo-500/20' }
  }
  return { label: 'Upcoming', textColor: 'text-muted-foreground', bgClass: 'bg-muted/30', borderClass: 'border-border/30' }
}"""

content = re.sub(r'function getStatusInfo.*?return \{ label: \'Upcoming\'.*?\}\n\}', new_get_status, content, flags=re.DOTALL)

# Update ActivityCard styles
content = content.replace("""        style={{
          backgroundColor: status.bg,
          border: `1px solid ${status.border}`,
        }}""", """        className={`p-5 rounded-2xl transition-all duration-200 cursor-pointer ${status.bgClass} border ${status.borderClass} hover:shadow-md hover:border-primary/30`}""")

# Remove the old onMouseEnter/onMouseLeave logic
content = re.sub(r'\n\s+onMouseEnter=\{e => \{.*?\n\s+\}\}\n\s+onMouseLeave=\{e => \{.*?\n\s+\}\}', '', content, flags=re.DOTALL)

# Also remove className="p-5 rounded-2xl transition-all duration-200 cursor-pointer" since we moved it to the dynamic string
content = content.replace("""    <Link href={href} className="block group">
      <div
        className="p-5 rounded-2xl transition-all duration-200 cursor-pointer"
        className={`p-5 rounded-2xl transition-all duration-200 cursor-pointer ${status.bgClass} border ${status.borderClass} hover:shadow-md hover:border-primary/30`}""", """    <Link href={href} className="block group">
      <div
        className={`p-5 rounded-2xl transition-all duration-200 cursor-pointer ${status.bgClass} border ${status.borderClass} hover:shadow-md hover:border-primary/30`}""")

# Update status badge
content = content.replace("""            {/* Status badge */}
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1"
              style={{
                backgroundColor: status.bg,
                color: status.color,
                border: `1px solid ${status.border}`
              }}
            >""", """            {/* Status badge */}
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 border ${status.bgClass} ${status.textColor} ${status.borderClass}`}
            >""")


# Fix text-muted-foreground/30 and text-[10px] text-muted-foreground issues
content = content.replace('text-muted-foreground/30 text-[10px]', 'text-muted-foreground/60 text-[10px]')
content = content.replace('text-[10px] text-muted-foreground', 'text-[10px] font-semibold text-foreground/70')

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\app\\(app)\\activities\\ActivitiesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("ActivitiesClient updated!")
