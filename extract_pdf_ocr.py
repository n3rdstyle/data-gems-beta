#!/usr/bin/env python3
"""
Extract questions and answers from image-based PDF using OCR
"""
import re
import csv
from pdf2image import convert_from_path
import pytesseract
from PIL import Image

def extract_text_from_pdf_with_ocr(pdf_path, max_pages=None):
    """Extract text from image-based PDF using OCR"""
    print(f"Converting PDF to images: {pdf_path}")
    print("This may take a while for large PDFs...")

    try:
        # Convert PDF to images (limiting to first few pages for testing)
        if max_pages:
            images = convert_from_path(pdf_path, first_page=1, last_page=max_pages)
            print(f"Processing first {max_pages} pages...")
        else:
            images = convert_from_path(pdf_path)
            print(f"Processing all {len(images)} pages...")

        all_text = ""
        for i, image in enumerate(images):
            print(f"OCR processing page {i+1}/{len(images)}...", end='\r')

            # Perform OCR on the image
            text = pytesseract.image_to_string(image, lang='eng')
            all_text += f"\n--- PAGE {i+1} ---\n{text}\n"

        print(f"\nOCR completed for {len(images)} pages")

        # Save raw OCR text
        with open('/Users/d.breuer/Desktop/Data Gems Beta/pdf_ocr_text.txt', 'w', encoding='utf-8') as f:
            f.write(all_text)
        print("Raw OCR text saved to pdf_ocr_text.txt")

        return all_text

    except Exception as e:
        print(f"Error during OCR: {e}")
        import traceback
        traceback.print_exc()
        return ""

def extract_qa_pairs(text):
    """Extract Q&A pairs from text"""
    qa_pairs = []

    # Try different patterns to match Q&A format
    # Pattern 1: Question number followed by question and answer
    # We'll need to adjust this based on what we see in the OCR output

    # For now, let's just save the raw text and examine it
    print("\nFirst 1000 characters of OCR text:")
    print(text[:1000])
    print("\n...")

    # We'll implement the parsing logic once we see the structure
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

    # First, let's process just the first 5 pages to see the structure
    print("Processing first 5 pages to examine structure...")
    text = extract_text_from_pdf_with_ocr(pdf_path, max_pages=5)

    if text:
        qa_pairs = extract_qa_pairs(text)

        if qa_pairs:
            save_to_csv(qa_pairs, output_csv)
        else:
            print("\nPlease examine pdf_ocr_text.txt to understand the Q&A structure.")
            print("We can then adjust the extraction logic accordingly.")
