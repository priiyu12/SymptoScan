import os
import re

directory = 'frontend/src/app/pages'
pattern_def = r"const API_BASE_URL = .*;"
replacement_def = "const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';"

# Pattern for mangled template literals (e.g. `${API_BASE_URL}/api/path/')
pattern_mangled = r"`\${API_BASE_URL}([^`]+)'"
replacement_mangled = r"`${API_BASE_URL}\1`"

for filename in os.listdir(directory):
    if filename.endswith('.tsx'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r') as f:
            content = f.read()

        # Ensure definition exists
        if 'API_BASE_URL' in content and 'const API_BASE_URL' not in content:
            # Add definition after imports
            lines = content.split('\n')
            insert_idx = 0
            for i, line in enumerate(lines):
                if line.startswith('import ') or line.strip() == '':
                    insert_idx = i + 1
                else:
                    break
            lines.insert(insert_idx, replacement_def)
            content = '\n'.join(lines)
        elif 'const API_BASE_URL' in content:
            # Correct potentially mangled definition
            content = re.sub(pattern_def, replacement_def, content)

        # Fix mangled template literals
        content = re.sub(pattern_mangled, replacement_mangled, content)
        
        # Double check for mixed quotes in axios calls
        content = re.sub(r"axios\.(get|post|put|delete)\(`${API_BASE_URL}([^`]+)'", r"axios.\1(`${API_BASE_URL}\2`", content)

        with open(filepath, 'w') as f:
            f.write(content)

print("Cleanup complete.")
