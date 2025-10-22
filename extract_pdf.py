#!/usr/bin/env python3
"""
Extract questions and answers from PDF and convert to CSV
"""
import re
import csv
from pypdf import PdfReader

def extract_qa_from_pdf(pdf_path):
    """Extract Q&A pairs from PDF"""
    print(f"Reading PDF: {pdf_path}")

    try:
        reader = PdfReader(pdf_path)
        print(f"Total pages: {len(reader.pages)}")

        # Extract all text
        all_text = ""
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            all_text += text + "\n"
            if i < 3:  # Print first few pages to understand structure
                print(f"\n--- Page {i+1} ---")
                print(text[:500])

        # Save raw text for inspection
        with open('/Users/d.breuer/Desktop/Data Gems Beta/pdf_raw_text.txt', 'w', encoding='utf-8') as f:
            f.write(all_text)
        print("\nRaw text saved to pdf_raw_text.txt")

        # Try to find Q&A patterns
        qa_pairs = []

        # Pattern 1: Look for numbered questions followed by answers
        # This is a placeholder - we need to see the actual structure
        pattern1 = r'(\d+)\.\s*([^\n]+)\n([^\n]+(?:\n(?!\d+\.)[^\n]+)*)'
        matches1 = re.findall(pattern1, all_text, re.MULTILINE)

        if matches1:
            print(f"\nFound {len(matches1)} potential Q&A pairs using pattern 1")
            for num, question, answer in matches1[:3]:
                qa_pairs.append({
                    'number': num,
                    'question': question.strip(),
                    'answer': answer.strip()
                })
                print(f"\nQ{num}: {question[:100]}")
                print(f"A: {answer[:100]}")

        return qa_pairs, all_text

    except Exception as e:
        print(f"Error: {e}")
        return [], ""

def save_to_csv(qa_pairs, output_path):
    """Save Q&A pairs to CSV"""
    if not qa_pairs:
        print("No Q&A pairs to save")
        return

    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['number', 'question', 'answer'])
        writer.writeheader()
        writer.writerows(qa_pairs)

    print(f"\nSaved {len(qa_pairs)} Q&A pairs to {output_path}")

if __name__ == '__main__':
    pdf_path = '/Users/d.breuer/Downloads/screencapture-chatgpt-c-68f1ed39-6920-8325-86c9-3c760f6c341b-2025-10-22-09_35_45.pdf'
    output_csv = '/Users/d.breuer/Desktop/Data Gems Beta/qa_export.csv'

    qa_pairs, raw_text = extract_qa_from_pdf(pdf_path)

    if qa_pairs:
        save_to_csv(qa_pairs, output_csv)
    else:
        print("\nNo Q&A pairs found. Check pdf_raw_text.txt to understand the structure.")
