#!/usr/bin/env python3
"""
Clean the extracted Q&A CSV by removing OCR artifacts
"""
import csv
import re

def clean_text(text):
    """Remove OCR artifacts and clean up text"""
    # Remove common OCR artifacts (various patterns from button clicks, etc.)
    text = re.sub(r'A[Oo@][bh]?[GgR6]?[VW]?[4L]?[EL86RVLES]+\s*', '', text)
    text = re.sub(r'[Aa]gh[WwVv][dD][AaDd][SsZ]\s*', '', text)
    text = re.sub(r'O[GgR6][VW]?[4L]?[EL86]+\s*', '', text)
    text = re.sub(r'[qgQ][""]*[vV]?z?a?rese\s*', '', text)

    # Remove standalone v, w, yw patterns
    text = re.sub(r'\s+[vVwW][\s\.]', ' ', text)
    text = re.sub(r'^[vVwW][\s\.]', '', text)
    text = re.sub(r'\s+yw\s+', ' ', text)
    text = re.sub(r'^yw\s+', '', text)
    text = re.sub(r'^\s*ny\s+', '', text)

    # Remove page markers
    text = re.sub(r'--- PAGE \d+ ---', '', text)

    # Remove "Frage [number]:" patterns that leaked into answers
    text = re.sub(r'Frage\s+\d+[:\.]?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'[rRfFiIt]{2,}a[ygY]e\s+\d+[""]*.*?a8\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'[bB]one\s+e[\.\,]\s*a8\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'[bB]on beteee?\s+o+\s*\d*\s*', '', text)

    # Clean up specific OCR noise patterns
    text = re.sub(r'Hateae\s*', '', text)
    text = re.sub(r'Cibo Abeta tee rene aw\s*', '', text)
    text = re.sub(r't[oO]ne\s+[\'"]?\s*e\.\s*a8\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'[Dd]ede\s+eee\s*\*\s*r\.\s*a8\s*', '', text)
    text = re.sub(r'Vo neete tee tetee Peeee\s*a8\s*', '', text)

    # Clean up "Welchen Song" type questions that leaked into answers
    text = re.sub(r'Welchen Song wiirdest du.*?wahlen\?', '', text)
    text = re.sub(r'Welche drei Apps.*?Ausnahme\?', '', text)
    text = re.sub(r'Was war als Kind.*?Lieblingsbeschaftigung\?', '', text)
    text = re.sub(r'Wenn du abends abschaltest.*?Podcasts\)\?', '', text)
    text = re.sub(r'Welches Tier fasziniert dich besonders\?', '', text)

    # Remove patterns like "seen woe bie" (OCR errors)
    text = re.sub(r'^seen woe bie\s+', 'Die ', text, flags=re.IGNORECASE)

    # Clean up multiple spaces and newlines
    text = re.sub(r'\s+', ' ', text)

    # Clean up trailing/leading whitespace
    text = text.strip()

    return text

def clean_csv(input_path, output_path):
    """Clean the CSV file"""
    cleaned_rows = []

    with open(input_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cleaned_row = {
                'number': row['number'],
                'question': clean_text(row['question']),
                'answer': clean_text(row['answer'])
            }
            cleaned_rows.append(cleaned_row)

    # Write cleaned data
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['number', 'question', 'answer'])
        writer.writeheader()
        writer.writerows(cleaned_rows)

    print(f"Cleaned {len(cleaned_rows)} Q&A pairs")
    print(f"Saved to: {output_path}")

if __name__ == '__main__':
    input_csv = '/Users/d.breuer/Desktop/Data Gems Beta/qa_export.csv'
    output_csv = '/Users/d.breuer/Desktop/Data Gems Beta/qa_export_cleaned.csv'

    clean_csv(input_csv, output_csv)

    # Show a sample
    print("\nSample of cleaned data:")
    with open(output_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            if i < 5:
                print(f"\nQ{row['number']}: {row['question'][:80]}...")
                print(f"A: {row['answer'][:100]}...")
            else:
                break
