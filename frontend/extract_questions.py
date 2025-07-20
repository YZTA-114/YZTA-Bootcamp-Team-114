#!/usr/bin/env python3
import PyPDF2
import re
import sys

def extract_turkish_questions(pdf_path):
    """PDF'den Türkçe sorularını çıkar"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            print(f"PDF sayfa sayısı: {len(pdf_reader.pages)}")
            print("=" * 50)
            
            all_text = ""
            for page_num, page in enumerate(pdf_reader.pages):
                text = page.extract_text()
                all_text += f"\n--- SAYFA {page_num + 1} ---\n{text}\n"
            
            # Türkçe soru kalıplarını ara
            turkish_patterns = [
                r'Soru\s+\d+[:\s]*([^A-D]+)',
                r'\d+[\.\)]\s*([^A-D]+)',
                r'[A-D][\.\)]\s*([^A-D]+)',
                r'([^A-D]+)\?',
                r'([^A-D]+)\s*\?'
            ]
            
            print("PDF İÇERİĞİ:")
            print(all_text)
            print("\n" + "=" * 50)
            print("TÜRKÇE SORULAR:")
            
            # Metni satır satır işle
            lines = all_text.split('\n')
            questions = []
            current_question = ""
            
            for line in lines:
                line = line.strip()
                if line:
                    # Soru başlangıcı ara
                    if re.search(r'Soru\s+\d+', line, re.IGNORECASE) or re.search(r'\d+[\.\)]', line):
                        if current_question:
                            questions.append(current_question)
                        current_question = line
                    elif current_question and (line.startswith('A)') or line.startswith('B)') or line.startswith('C)') or line.startswith('D)')):
                        current_question += "\n" + line
                    elif current_question:
                        current_question += " " + line
            
            if current_question:
                questions.append(current_question)
            
            for i, question in enumerate(questions, 1):
                print(f"\nSORU {i}:")
                print(question)
                print("-" * 30)
            
            return all_text
            
    except Exception as e:
        print(f"Hata: {e}")
        return None

if __name__ == "__main__":
    pdf_path = "src/assets/docs/sbs2011_8a_ge.pdf"
    extract_turkish_questions(pdf_path) 