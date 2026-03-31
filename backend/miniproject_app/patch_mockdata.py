import re

with open("disease-prediction-frontend/src/app/data/mockData.ts", "r") as f:
    content = f.read()

# Replace interface
interface_target = """export interface Symptom {
  id: string;
  name: string;
  category: string;
}"""
interface_rep = """export interface Symptom {
  id: string;
  name: string;
  category: string;
  value: string;
}"""
content = content.replace(interface_target, interface_rep)

# Read new symptoms
with open("new_symptoms2.ts", "r") as f:
    new_symptoms = f.read()

# Replace the array
content = re.sub(r'export const symptoms: Symptom\[\] = \[.*?\];', new_symptoms.strip(), content, flags=re.DOTALL)

with open("disease-prediction-frontend/src/app/data/mockData.ts", "w") as f:
    f.write(content)
print("Updated mockData.ts")
