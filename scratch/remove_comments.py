import re

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\app\\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\app\\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed HTML comments")
