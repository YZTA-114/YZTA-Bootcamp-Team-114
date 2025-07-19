#!/usr/bin/env python3
import PyPDF2
import re

def extract_turkish_questions(pdf_path):
    """PDF'den sadece Türkçe sorularını çıkar"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            print(f"PDF sayfa sayısı: {len(pdf_reader.pages)}")
            print("=" * 80)
            
            all_text = ""
            for page_num, page in enumerate(pdf_reader.pages):
                text = page.extract_text()
                all_text += f"\n--- SAYFA {page_num + 1} ---\n{text}\n"
            
            # Türkçe bölümünü bul
            turkish_section = ""
            lines = all_text.split('\n')
            in_turkish_section = False
            
            for line in lines:
                line = line.strip()
                if 'TÜRKÇE' in line and 'MATEMATİK' not in line:
                    in_turkish_section = True
                    print(f"TÜRKÇE BÖLÜMÜ BAŞLADI: {line}")
                    continue
                elif in_turkish_section and ('MATEMATİK' in line or 'FEN' in line or 'SOSYAL' in line):
                    in_turkish_section = False
                    print(f"TÜRKÇE BÖLÜMÜ BİTTİ: {line}")
                    break
                
                if in_turkish_section:
                    turkish_section += line + "\n"
            
            print("\n" + "=" * 80)
            print("TÜRKÇE BÖLÜMÜ İÇERİĞİ:")
            print(turkish_section)
            print("=" * 80)
            
            # Soruları ayır
            questions = []
            current_question = ""
            question_number = 0
            
            turkish_lines = turkish_section.split('\n')
            for line in turkish_lines:
                line = line.strip()
                if not line:
                    continue
                
                # Soru başlangıcı ara
                if re.match(r'^\d+\.', line) or re.match(r'^Soru\s+\d+', line):
                    if current_question:
                        questions.append(current_question)
                    current_question = line
                    question_number += 1
                elif current_question and (line.startswith('A)') or line.startswith('B)') or line.startswith('C)') or line.startswith('D)')):
                    current_question += "\n" + line
                elif current_question:
                    current_question += " " + line
            
            if current_question:
                questions.append(current_question)
            
            print(f"\nBULUNAN TÜRKÇE SORU SAYISI: {len(questions)}")
            print("=" * 80)
            
            for i, question in enumerate(questions, 1):
                print(f"\nSORU {i}:")
                print(question)
                print("-" * 50)
            
            return questions
            
    except Exception as e:
        print(f"Hata: {e}")
        return None

if __name__ == "__main__":
    pdf_path = "src/assets/docs/sbs2011_8a_ge.pdf"
    extract_turkish_questions(pdf_path) 