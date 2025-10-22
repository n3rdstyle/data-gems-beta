#!/usr/bin/env python3
"""
Extract all questions and answers from the PDF using OCR
"""
import re
import csv
from pdf2image import convert_from_path
import pytesseract

def extract_text_from_all_pages(pdf_path):
    """Extract text from all PDF pages using OCR"""
    print(f"Converting all pages from PDF: {pdf_path}")
    print("This will take several minutes for 49 pages...")

    try:
        images = convert_from_path(pdf_path)
        print(f"\nProcessing {len(images)} pages...")

        all_text = ""
        for i, image in enumerate(images):
            print(f"OCR processing page {i+1}/{len(images)}...", end='\r')
            text = pytesseract.image_to_string(image, lang='deu+eng')
            all_text += f"\n--- PAGE {i+1} ---\n{text}\n"

        print(f"\nOCR completed for all {len(images)} pages")

        # Save raw OCR text
        with open('/Users/d.breuer/Desktop/Data Gems Beta/pdf_full_ocr_text.txt', 'w', encoding='utf-8') as f:
            f.write(all_text)
        print("Full OCR text saved to pdf_full_ocr_text.txt")

        return all_text

    except Exception as e:
        print(f"Error during OCR: {e}")
        import traceback
        traceback.print_exc()
        return ""

def extract_qa_pairs(text):
    """Extract Q&A pairs from OCR text"""
    qa_pairs = []

    # Pattern to match:
    # Frage [number]: [question text]
    # [Some OCR artifacts like AbV4LE]
    # [answer text until next Frage]

    # Split by "Frage" markers
    sections = re.split(r'(Frage\s+\d+:?)', text, flags=re.IGNORECASE)

    current_question_num = None
    current_question = None

    for i in range(1, len(sections), 2):
        if i + 1 < len(sections):
            # Extract question number
            question_header = sections[i]
            match = re.search(r'Frage\s+(\d+)', question_header, re.IGNORECASE)

            if match:
                question_num = match.group(1)

                # Get the content after the question header
                content = sections[i + 1]

                # Split into lines and clean
                lines = content.strip().split('\n')

                # Find the question (usually first non-empty line)
                question_text = ""
                answer_text = ""
                found_answer = False

                for line in lines:
                    line = line.strip()

                    # Skip OCR artifacts and UI elements
                    if not line or re.match(r'^A[Oo@].*?[VLE46]+\s*$', line) or line == 'v':
                        if question_text and not found_answer:
                            found_answer = True
                        continue

                    # Skip page markers
                    if line.startswith('--- PAGE'):
                        continue

                    if not found_answer:
                        # Still building the question
                        if question_text:
                            question_text += " " + line
                        else:
                            question_text = line
                    else:
                        # Building the answer
                        if answer_text:
                            answer_text += " " + line
                        else:
                            answer_text = line

                # Clean up the text
                question_text = re.sub(r'\s+', ' ', question_text).strip()
                answer_text = re.sub(r'\s+', ' ', answer_text).strip()

                if question_text and answer_text:
                    qa_pairs.append({
                        'number': question_num,
                        'question': question_text,
                        'answer': answer_text
                    })
                    print(f"Extracted Q{question_num}: {question_text[:60]}...")

    return qa_pairs

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

    # Extract text from all pages
    print("Starting full PDF OCR extraction...")
    text = extract_text_from_all_pages(pdf_path)

    if text:
        print("\nExtracting Q&A pairs...")
        qa_pairs = extract_qa_pairs(text)

        if qa_pairs:
            save_to_csv(qa_pairs, output_csv)
            print(f"\n✓ Successfully extracted {len(qa_pairs)} questions and answers!")
            print(f"✓ CSV file ready at: {output_csv}")
        else:
            print("\nNo Q&A pairs found. Check pdf_full_ocr_text.txt for raw OCR output.")
