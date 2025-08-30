// import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';

// @Component({
//   selector: 'nlabs-text-editor',
//   imports: [],
//   templateUrl: './nlabs-text-editor.html',
//   styleUrls: ['./nlabs-text-editor.css']
// })
// export class TextEditor implements OnInit, AfterViewInit {
//   @ViewChild('editor', { static: true }) editor!: ElementRef<HTMLDivElement>;
  
//   @Input() content: string = '';
//   @Input() minHeight: string = '600px';
//   @Input() darkMode: boolean = false;
//   @Output() contentChange = new EventEmitter<string>();

//   // Editor durumu - Updated
//   isEditorActive = false;
//   isPreviewMode = false;
//   showOutput = false; // HTML çıktı paneli
//   selectedText = '';
//   currentFontSize = 12;
//   currentFontFamily = 'Calibri';
//   currentTextColor = '#000000';
//   currentBgColor = 'transparent';
//   wordCount = 0;
//   charCount = 0;
//   paragraphCount = 0;
  
//   // Formatlar - Word uyumlu
//   fontSizes = [8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 48, 72];
//   fontFamilies = [
//     'Calibri', 'Arial', 'Times New Roman', 'Georgia', 'Verdana', 
//     'Tahoma', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 
//     'Impact', 'Lucida Console', 'Courier New', 'Palatino'
//   ];

//   // Heading seviyeleri
//   headingLevels = [
//     { value: 'div', text: 'Normal' },
//     { value: 'h1', text: 'Başlık 1' },
//     { value: 'h2', text: 'Başlık 2' },
//     { value: 'h3', text: 'Başlık 3' },
//     { value: 'h4', text: 'Başlık 4' },
//     { value: 'h5', text: 'Başlık 5' },
//     { value: 'h6', text: 'Başlık 6' }
//   ];

//   ngOnInit() {
//     if (this.content) {
//       this.updateContent();
//     }
//     this.checkMethodExists();
//   }

//   checkMethodExists() {
//     const methods = [
//       'insertImage', 'insertTable', 'insertLink', 'undo', 'redo',
//       'insertBlockquote', 'insertCode', 'openTextColorPicker', 'openBgColorPicker'
//     ];
    
//     methods.forEach(method => {
//       if (typeof (this as any)[method] === 'function') {
//         console.log(`✅ Method ${method} exists`);
//       } else {
//         console.log(`❌ Method ${method} NOT FOUND`);
//       }
//     });
//   }

//   ngAfterViewInit() {
//     this.editor.nativeElement.innerHTML = this.content;
//     this.updateWordCount();
//     this.setupEditor();
//   }

//   setupEditor() {
//     const editorEl = this.editor.nativeElement;
    
//     // Word benzeri ayarlar
//     editorEl.style.direction = 'ltr';
//     editorEl.style.textAlign = 'left';
//     editorEl.style.unicodeBidi = 'normal';
//     editorEl.style.fontFamily = 'Calibri, sans-serif';
//     editorEl.style.fontSize = '12pt';
//     editorEl.style.lineHeight = '1.08';
    
//     // Word paste olayını gelişmiş handle et
//     editorEl.addEventListener('paste', (e) => {
//       e.preventDefault();
//       this.handleAdvancedWordPaste(e);
//     });

//     // Input olayları
//     editorEl.addEventListener('input', () => {
//       this.onContentChange();
//     });

//     // Selection olayları
//     document.addEventListener('selectionchange', () => {
//       this.updateSelection();
//     });

//     // Keyboard shortcuts
//     editorEl.addEventListener('keydown', (e) => {
//       this.handleKeyboard(e);
//     });

//     // Drop olayları
//     editorEl.addEventListener('drop', (e) => {
//       e.preventDefault();
//       this.handleFileDrop(e);
//     });

//     editorEl.addEventListener('dragover', (e) => {
//       e.preventDefault();
//       editorEl.classList.add('dragover');
//     });

//     editorEl.addEventListener('dragleave', (e) => {
//       editorEl.classList.remove('dragover');
//     });

//     // Focus/blur olayları
//     editorEl.addEventListener('focus', () => {
//       this.onEditorFocus();
//     });

//     editorEl.addEventListener('blur', () => {
//       this.onEditorBlur();
//     });
//   }

//   handleAdvancedWordPaste(e: ClipboardEvent) {
//     const clipboardData = e.clipboardData;
//     if (!clipboardData) return;

//     // Word'den gelen farklı veri formatlarını kontrol et
//     const htmlData = clipboardData.getData('text/html');
//     const rtfData = clipboardData.getData('text/rtf');
//     const textData = clipboardData.getData('text/plain');

//     console.log('HTML Data:', htmlData);
//     console.log('RTF Data:', rtfData);
//     console.log('Text Data:', textData);

//     if (htmlData) {
//       // Word HTML'ini gelişmiş temizleme ile işle
//       const processedHtml = this.processWordHtml(htmlData);
//       this.insertProcessedHtml(processedHtml);
//     } else if (textData) {
//       // Düz metin varsa paragraf yapısını koru
//       this.insertFormattedText(textData);
//     }

//     this.onContentChange();
//   }

//   processWordHtml(html: string): string {
//     let processed = html;

//     // Word'ün XML namespace'lerini koru ama temizle
//     processed = processed.replace(/xmlns:\w+="[^"]*"/g, '');
    
//     // Microsoft Office conditional comments'leri kaldır
//     processed = processed.replace(/<!--\[if[^>]*>.*?<!\[endif\]-->/gs, '');
    
//     // Word'e özgü tag'leri kaldır ama içeriklerini koru
//     processed = processed.replace(/<\/?o:\w+[^>]*>/gi, '');
//     processed = processed.replace(/<\/?w:\w+[^>]*>/gi, '');
//     processed = processed.replace(/<\/?m:\w+[^>]*>/gi, '');
//     processed = processed.replace(/<\/?v:\w+[^>]*>/gi, '');

//     // Style özelliklerini akıllıca işle - önemli olanları koru
//     processed = this.preserveImportantStyles(processed);

//     // Word'ün paragraph yapısını koru
//     processed = this.preserveWordParagraphs(processed);

//     // Font bilgilerini koru
//     processed = this.preserveFontInfo(processed);

//     // Tablolarıdeformatını koru
//     processed = this.preserveTableFormatting(processed);

//     // Listeleri koru
//     processed = this.preserveListFormatting(processed);

//     // Başlıkları koru
//     processed = this.preserveHeadingFormatting(processed);

//     // Boş elemanları temizle
//     processed = this.cleanEmptyElements(processed);

//     return processed.trim();
//   }

//   preserveImportantStyles(html: string): string {
//     return html.replace(/style="([^"]*)"/gi, (match, styles) => {
//       const importantStyles: string[] = [];
//       const styleProps = styles.split(';').map((s: string) => s.trim()).filter((s: string) => s);
      
//       for (const prop of styleProps) {
//         const [key, value] = prop.split(':').map((s: string) => s.trim());
//         if (!key || !value) continue;

//         // Önemli stil özelliklerini koru ama background-color'u filtrele
//         if (this.isImportantStyle(key, value)) {
//           // Dark mode uyumluluğu için background-color'u kaldır
//           if (key.toLowerCase() === 'background-color' || key.toLowerCase() === 'background') {
//             // Sadece şeffaf değilse ve beyaz değilse koru
//             if (value.toLowerCase() !== 'white' && 
//                 value.toLowerCase() !== '#ffffff' && 
//                 value.toLowerCase() !== '#fff' &&
//                 value.toLowerCase() !== 'transparent' &&
//                 value.toLowerCase() !== 'rgb(255, 255, 255)' &&
//                 value.toLowerCase() !== 'rgba(255, 255, 255, 1)') {
//               // Diğer background renklerini koru ama opacity ekle
//               importantStyles.push(`${key}: ${value}`);
//             }
//           } else {
//             importantStyles.push(`${key}: ${value}`);
//           }
//         }
//       }

//       return importantStyles.length > 0 ? `style="${importantStyles.join('; ')}"` : '';
//     });
//   }

//   isImportantStyle(key: string, value: string): boolean {
//     const importantStyleKeys = [
//       'font-family', 'font-size', 'font-weight', 'font-style',
//       'color', 'text-align', 'text-decoration',
//       'line-height', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
//       'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
//       'border', 'border-top', 'border-bottom', 'border-left', 'border-right',
//       'width', 'height', 'vertical-align'
//     ];

//     // MSO özel stilleri kaldır
//     if (key.startsWith('mso-') || key.startsWith('-ms-')) return false;
    
//     // Background-color'u özel olarak kontrol et
//     if (key.toLowerCase() === 'background-color' || key.toLowerCase() === 'background') {
//       // Sadece gerçekten önemli background renklerini koru
//       return !this.isUnwantedBackground(value);
//     }
    
//     // Önemli stiller mi kontrol et
//     return importantStyleKeys.some(important => key.toLowerCase().includes(important.toLowerCase()));
//   }

//   // Yeni fonksiyon: İstenmeyen background renklerini tespit et
//   isUnwantedBackground(value: string): boolean {
//     const unwantedBackgrounds = [
//       'white', '#ffffff', '#fff', 'transparent', 
//       'rgb(255, 255, 255)', 'rgba(255, 255, 255, 1)',
//       'rgb(255,255,255)', 'rgba(255,255,255,1)',
//       '#FFFFFF', '#FFF'
//     ];
    
//     return unwantedBackgrounds.some(unwanted => 
//       value.toLowerCase().trim() === unwanted.toLowerCase()
//     );
//   }

//   preserveWordParagraphs(html: string): string {
//     // Word'ün <p> tag'lerini koru ve MsoNormal class'ını temizle
//     return html
//       .replace(/class="?MsoNormal"?/gi, '')
//       .replace(/<p\s*class="[^"]*"([^>]*)>/gi, '<p$1>')
//       .replace(/<p\s*>/gi, '<p>')
//       .replace(/<\/p>/gi, '</p>');
//   }

//   preserveFontInfo(html: string): string {
//     // Font tag'lerini span'a çevir
//     return html.replace(/<font([^>]*)>(.*?)<\/font>/gi, (match, attrs, content) => {
//       let styles = [];
      
//       // Face attribute'unu font-family'ye çevir
//       const faceMatch = attrs.match(/face="([^"]*)"/i);
//       if (faceMatch) {
//         styles.push(`font-family: ${faceMatch[1]}`);
//       }
      
//       // Size attribute'unu font-size'a çevir
//       const sizeMatch = attrs.match(/size="([^"]*)"/i);
//       if (sizeMatch) {
//         const size = parseInt(sizeMatch[1]);
//         const fontSize = this.convertWordFontSize(size);
//         styles.push(`font-size: ${fontSize}`);
//       }
      
//       // Color attribute'unu color'a çevir
//       const colorMatch = attrs.match(/color="([^"]*)"/i);
//       if (colorMatch) {
//         styles.push(`color: ${colorMatch[1]}`);
//       }
      
//       const styleAttr = styles.length > 0 ? ` style="${styles.join('; ')}"` : '';
//       return `<span${styleAttr}>${content}</span>`;
//     });
//   }

//   convertWordFontSize(wordSize: number): string {
//     // Word font size'ını pt'ye çevir
//     const sizeMap: {[key: number]: string} = {
//       1: '8pt', 2: '10pt', 3: '12pt', 4: '14pt', 
//       5: '18pt', 6: '24pt', 7: '36pt'
//     };
//     return sizeMap[wordSize] || '12pt';
//   }

//   preserveTableFormatting(html: string): string {
//     // Tablo formatlamasını koru
//     return html
//       .replace(/<table[^>]*>/gi, (match) => {
//         // Word tablo stillerini web uyumlu hale getir
//         let tableTag = match
//           .replace(/border="?0"?/gi, '')
//           .replace(/cellspacing="?0"?/gi, '')
//           .replace(/cellpadding="?0"?/gi, '');
        
//         if (!tableTag.includes('style=')) {
//           tableTag = tableTag.replace('<table', '<table style="border-collapse: collapse; width: 100%;"');
//         }
        
//         return tableTag;
//       })
//       .replace(/<td[^>]*>/gi, (match) => {
//         // TD stil düzenlemesi
//         if (!match.includes('style=')) {
//           return match.replace('<td', '<td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;"');
//         }
//         return match;
//       });
//   }

//   preserveListFormatting(html: string): string {
//     // Liste formatlamasını koru
//     return html
//       .replace(/<p[^>]*style="[^"]*mso-list[^"]*"[^>]*>/gi, '<li>')
//       .replace(/<p[^>]*mso-list[^>]*>/gi, '<li>')
//       .replace(/<\/p>/gi, (match, offset, string) => {
//         // Eğer bir sonraki element li ise </p> yerine </li> koy
//         const nextContent = string.slice(offset + match.length, offset + match.length + 50);
//         if (nextContent.includes('<li>')) {
//           return '</li>';
//         }
//         return match;
//       });
//   }

//   preserveHeadingFormatting(html: string): string {
//     // Word başlıklarını HTML başlıklarına çevir
//     return html
//       .replace(/<p[^>]*style="[^"]*font-size:\s*24pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h1>$1</h1>')
//       .replace(/<p[^>]*style="[^"]*font-size:\s*18pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h2>$1</h2>')
//       .replace(/<p[^>]*style="[^"]*font-size:\s*16pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h3>$1</h3>')
//       .replace(/<p[^>]*style="[^"]*font-size:\s*14pt[^"]*"[^>]*>(.*?)<\/p>/gi, '<h4>$1</h4>');
//   }

//   cleanEmptyElements(html: string): string {
//     return html
//       .replace(/<(\w+)[^>]*>\s*<\/\1>/gi, '') // Boş tag'lar
//       .replace(/\s+/g, ' ') // Fazla boşluklar
//       .replace(/>\s+</g, '><') // Tag'ler arası boşluklar
//       .replace(/<br\s*\/?>\s*<\/p>/gi, '</p>') // P sonundaki BR'ler
//       .replace(/<p[^>]*>\s*<br\s*\/?>\s*<\/p>/gi, '<p><br></p>'); // Sadece BR içeren P'ler
//   }

//   insertProcessedHtml(html: string) {
//     const selection = window.getSelection();
//     if (selection && selection.rangeCount > 0) {
//       const range = selection.getRangeAt(0);
//       range.deleteContents();

//       // Temporary container
//       const tempDiv = document.createElement('div');
//       tempDiv.innerHTML = html;

//       // Fragment oluştur
//       const fragment = document.createDocumentFragment();
      
//       // Child elementleri fragment'e ekle
//       while (tempDiv.firstChild) {
//         fragment.appendChild(tempDiv.firstChild);
//       }

//       range.insertNode(fragment);
      
//       // Cursor'ı sona taşı
//       range.collapse(false);
//       selection.removeAllRanges();
//       selection.addRange(range);
//     }
//   }

//   insertFormattedText(text: string) {
//     const lines = text.split('\n');
//     const selection = window.getSelection();
    
//     if (selection && selection.rangeCount > 0) {
//       const range = selection.getRangeAt(0);
//       range.deleteContents();
      
//       const fragment = document.createDocumentFragment();
      
//       lines.forEach((line, index) => {
//         if (index > 0) {
//           const p = document.createElement('p');
//           p.innerHTML = line.trim() || '<br>';
//           fragment.appendChild(p);
//         } else {
//           if (line.trim()) {
//             fragment.appendChild(document.createTextNode(line));
//           }
//         }
//       });
      
//       range.insertNode(fragment);
//       range.collapse(false);
//       selection.removeAllRanges();
//       selection.addRange(range);
//     }
//   }

//   handleKeyboard(e: KeyboardEvent) {
//     if (e.ctrlKey) {
//       switch(e.key.toLowerCase()) {
//         case 'b':
//           e.preventDefault();
//           this.toggleFormat('bold');
//           break;
//         case 'i':
//           e.preventDefault();
//           this.toggleFormat('italic');
//           break;
//         case 'u':
//           e.preventDefault();
//           this.toggleFormat('underline');
//           break;
//         case 'z':
//           e.preventDefault();
//           if (e.shiftKey) {
//             document.execCommand('redo');
//           } else {
//             document.execCommand('undo');
//           }
//           break;
//         case 's':
//           e.preventDefault();
//           this.autoSave();
//           break;
//       }
//     }
    
//     // Enter tuşu davranışını düzenle
//     if (e.key === 'Enter') {
//       if (!e.shiftKey) {
//         // Normal enter - yeni paragraf
//         this.insertParagraph();
//         e.preventDefault();
//       }
//       // Shift+Enter - line break
//     }
//   }

//   insertParagraph() {
//     const selection = window.getSelection();
//     if (selection && selection.rangeCount > 0) {
//       const range = selection.getRangeAt(0);
//       const p = document.createElement('p');
//       p.innerHTML = '<br>';
      
//       range.deleteContents();
//       range.insertNode(p);
      
//       // Cursor'ı yeni paragrafın içine taşı
//       range.setStart(p, 0);
//       range.collapse(true);
//       selection.removeAllRanges();
//       selection.addRange(range);
//     }
//   }

//   applyHeading(level: string) {
//     const selection = window.getSelection();
//     if (selection && selection.rangeCount > 0) {
//       const range = selection.getRangeAt(0);
//       const container = range.commonAncestorContainer;
      
//       // En yakın block elementi bul
//       let blockElement = container.nodeType === Node.TEXT_NODE ? 
//         container.parentElement : container as Element;
      
//       while (blockElement && !this.isBlockElement(blockElement)) {
//         blockElement = blockElement.parentElement;
//       }
      
//       if (blockElement) {
//         const newElement = document.createElement(level);
//         newElement.innerHTML = blockElement.innerHTML;
//         blockElement.parentNode?.replaceChild(newElement, blockElement);
//         this.onContentChange();
//       }
//     }
//   }

//   isBlockElement(element: Element): boolean {
//     const blockElements = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE'];
//     return blockElements.includes(element.tagName);
//   }

//   toggleFormat(command: string) {
//     document.execCommand(command, false);
//     this.onContentChange();
//     this.editor.nativeElement.focus();
//   }

//   applyFontSize(size: number) {
//     this.currentFontSize = size;
    
//     const selection = window.getSelection();
//     if (selection && selection.rangeCount > 0) {
//       const range = selection.getRangeAt(0);
//       if (!range.collapsed) {
//         const span = document.createElement('span');
//         span.style.fontSize = size + 'pt';
//         try {
//           range.surroundContents(span);
//         } catch (e) {
//           const contents = range.extractContents();
//           span.appendChild(contents);
//           range.insertNode(span);
//         }
//       }
//     }
    
//     this.onContentChange();
//     this.editor.nativeElement.focus();
//   }

//   applyFontFamily(family: string) {
//     this.currentFontFamily = family;
//     document.execCommand('fontName', false, family);
//     this.onContentChange();
//     this.editor.nativeElement.focus();
//   }

//   applyTextColor(color: string) {
//     this.currentTextColor = color;
//     document.execCommand('foreColor', false, color);
//     this.onContentChange();
//     this.editor.nativeElement.focus();
//   }

//   applyBackgroundColor(color: string) {
//     this.currentBgColor = color;
//     if (color === 'transparent' || color === '') {
//       // Background'u kaldır
//       const selection = window.getSelection();
//       if (selection && selection.rangeCount > 0) {
//         const range = selection.getRangeAt(0);
//         if (!range.collapsed) {
//           // Seçili metin varsa sadece onun background'unu kaldır
//           document.execCommand('removeFormat', false);
//         }
//       }
//     } else {
//       document.execCommand('backColor', false, color);
//     }
//     this.onContentChange();
//     this.editor.nativeElement.focus();
//   }

//   openTextColorPicker() {
//     const colorPicker = document.getElementById('textColorPicker') as HTMLInputElement;
//     if (colorPicker) {
//       colorPicker.click();
//     }
//   }

//   openBgColorPicker() {
//     const colorPicker = document.getElementById('bgColorPicker') as HTMLInputElement;
//     if (colorPicker) {
//       colorPicker.click();
//     }
//   }

//   clearBackgroundColor() {
//     this.currentBgColor = 'transparent';
//     const selection = window.getSelection();
//     if (selection && selection.rangeCount > 0) {
//       const range = selection.getRangeAt(0);
//       if (!range.collapsed) {
//         // Seçili metni span içine al ve background'u kaldır
//         const selectedContent = range.extractContents();
//         const span = document.createElement('span');
//         span.style.backgroundColor = 'transparent';
//         span.appendChild(selectedContent);
//         range.insertNode(span);
//       }
//     }
//     this.onContentChange();
//     this.editor.nativeElement.focus();
//   }

//   alignText(alignment: string) {
//     document.execCommand('justify' + alignment, false);
//     this.onContentChange();
//     this.editor.nativeElement.focus();
//   }

//   insertList(type: 'ordered' | 'unordered') {
//     const command = type === 'ordered' ? 'insertOrderedList' : 'insertUnorderedList';
//     document.execCommand(command, false);
//     this.onContentChange();
//     this.editor.nativeElement.focus();
//   }

//   insertTable() {
//     console.log('insertTable method called!');
    
//     // Editöre focus et
//     this.editor.nativeElement.focus();
    
//     setTimeout(() => {
//       const dialog = this.createTableDialog();
//       document.body.appendChild(dialog);
//     }, 50);
//   }

//   createTableDialog(): HTMLElement {
//     const overlay = document.createElement('div');
//     overlay.className = 'table-dialog-overlay';
//     overlay.style.cssText = `
//       position: fixed;
//       top: 0;
//       left: 0;
//       width: 100%;
//       height: 100%;
//       background: rgba(0, 0, 0, 0.5);
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       z-index: 10000;
//     `;

//     const dialog = document.createElement('div');
//     dialog.className = 'table-dialog';
//     dialog.style.cssText = `
//       background: white;
//       border-radius: 8px;
//       padding: 20px;
//       min-width: 400px;
//       max-width: 500px;
//       box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
//     `;

//     dialog.innerHTML = `
//       <h3 style="margin: 0 0 20px 0; color: #333;">⊞ Gelişmiş Tablo Ekle</h3>
      
//       <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
//         <div>
//           <label style="display: block; margin-bottom: 5px; font-weight: bold;">Satır Sayısı:</label>
//           <input type="number" id="tableRows" value="3" min="1" max="20" 
//                  style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
//         </div>
//         <div>
//           <label style="display: block; margin-bottom: 5px; font-weight: bold;">Sütun Sayısı:</label>
//           <input type="number" id="tableCols" value="3" min="1" max="10" 
//                  style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
//         </div>
//       </div>
      
//       <div style="margin-bottom: 15px;">
//         <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
//           <input type="checkbox" id="tableHeaders" checked>
//           <span>İlk satır başlık olsun</span>
//         </label>
//         <label style="display: flex; align-items: center; gap: 8px;">
//           <input type="checkbox" id="tableStripes">
//           <span>Alternatif satır renklendirme</span>
//         </label>
//       </div>
      
//       <div style="margin-bottom: 15px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: bold;">Tablo Stili:</label>
//         <select id="tableStyle" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
//           <option value="simple">Basit (Border yok)</option>
//           <option value="bordered">Kenarlıklı</option>
//           <option value="modern">Modern (Gölgeli)</option>
//           <option value="professional">Profesyonel</option>
//           <option value="minimal">Minimal</option>
//           <option value="colorful">Renkli</option>
//         </select>
//       </div>

//       <div style="margin-bottom: 15px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: bold;">Border Kalınlığı:</label>
//         <select id="borderWidth" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
//           <option value="0">Border Yok</option>
//           <option value="1" selected>İnce (1px)</option>
//           <option value="2">Orta (2px)</option>
//           <option value="3">Kalın (3px)</option>
//         </select>
//       </div>

//       <div style="margin-bottom: 15px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: bold;">Border Rengi:</label>
//         <input type="color" id="borderColor" value="#dddddd" 
//                style="width: 100%; height: 40px; padding: 4px; border: 1px solid #ddd; border-radius: 4px;">
//       </div>

//       <div style="margin-bottom: 15px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: bold;">Başlık Arka Plan Rengi:</label>
//         <input type="color" id="headerBgColor" value="#f8f9fa" 
//                style="width: 100%; height: 40px; padding: 4px; border: 1px solid #ddd; border-radius: 4px;">
//       </div>

//       <div style="margin-bottom: 20px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: bold;">Başlık Metin Rengi:</label>
//         <input type="color" id="headerTextColor" value="#212529" 
//                style="width: 100%; height: 40px; padding: 4px; border: 1px solid #ddd; border-radius: 4px;">
//       </div>

//       <div style="margin-bottom: 20px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: bold;">Tablo Genişliği:</label>
//         <select id="tableWidth" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
//           <option value="auto">Otomatik</option>
//           <option value="50%">%50</option>
//           <option value="75%">%75</option>
//           <option value="100%" selected>%100</option>
//           <option value="fixed">Sabit (600px)</option>
//         </select>
//       </div>
      
//       <div style="text-align: right;">
//         <button id="cancelBtn" style="margin-right: 10px; padding: 8px 16px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer;">
//           İptal
//         </button>
//         <button id="insertBtn" style="padding: 8px 16px; border: none; background: #007cba; color: white; border-radius: 4px; cursor: pointer;">
//           Ekle
//         </button>
//       </div>
//     `;

//     overlay.appendChild(dialog);

//     // Event listeners
//     const rowsInput = dialog.querySelector('#tableRows') as HTMLInputElement;
//     const colsInput = dialog.querySelector('#tableCols') as HTMLInputElement;
//     const headersCheckbox = dialog.querySelector('#tableHeaders') as HTMLInputElement;
//     const stripesCheckbox = dialog.querySelector('#tableStripes') as HTMLInputElement;
//     const styleSelect = dialog.querySelector('#tableStyle') as HTMLSelectElement;
//     const borderWidthSelect = dialog.querySelector('#borderWidth') as HTMLSelectElement;
//     const borderColorInput = dialog.querySelector('#borderColor') as HTMLInputElement;
//     const headerBgColorInput = dialog.querySelector('#headerBgColor') as HTMLInputElement;
//     const headerTextColorInput = dialog.querySelector('#headerTextColor') as HTMLInputElement;
//     const tableWidthSelect = dialog.querySelector('#tableWidth') as HTMLSelectElement;
//     const cancelBtn = dialog.querySelector('#cancelBtn') as HTMLButtonElement;
//     const insertBtn = dialog.querySelector('#insertBtn') as HTMLButtonElement;

//     // Satır input'una focus
//     setTimeout(() => rowsInput.focus(), 100);

//     // İptal butonu
//     cancelBtn.addEventListener('click', () => {
//       overlay.remove();
//     });

//     // Overlay'e tıklayınca kapatma
//     overlay.addEventListener('click', (e) => {
//       if (e.target === overlay) {
//         overlay.remove();
//       }
//     });

//     // ESC tuşu ile kapatma
//     document.addEventListener('keydown', function escHandler(e) {
//       if (e.key === 'Escape') {
//         overlay.remove();
//         document.removeEventListener('keydown', escHandler);
//       }
//     });

//     // Ekle butonu
//     insertBtn.addEventListener('click', () => {
//       const rows = parseInt(rowsInput.value) || 3;
//       const cols = parseInt(colsInput.value) || 3;
//       const hasHeaders = headersCheckbox.checked;
//       const hasStripes = stripesCheckbox.checked;
//       const style = styleSelect.value;
//       const borderWidth = parseInt(borderWidthSelect.value) || 1;
//       const borderColor = borderColorInput.value;
//       const headerBgColor = headerBgColorInput.value;
//       const headerTextColor = headerTextColorInput.value;
//       const tableWidth = tableWidthSelect.value;

//       if (rows < 1 || rows > 20 || cols < 1 || cols > 10) {
//         alert('Lütfen geçerli satır (1-20) ve sütun (1-10) sayısı girin.');
//         return;
//       }

//       const tableOptions = {
//         style,
//         borderWidth,
//         borderColor,
//         headerBgColor,
//         headerTextColor,
//         tableWidth,
//         hasStripes
//       };

//       const table = this.createAdvancedTable(rows, cols, hasHeaders, tableOptions);
//       this.insertElement(table);
//       overlay.remove();
//     });

//     return overlay;
//   }

//   createAdvancedTable(rows: number, cols: number, hasHeaders: boolean, options: any): HTMLTableElement {
//     const table = document.createElement('table');
//     table.style.borderCollapse = 'collapse';
//     table.style.margin = '10px 0';
//     table.style.fontFamily = 'inherit';
    
//     // Tablo genişliği
//     switch (options.tableWidth) {
//       case 'auto':
//         table.style.width = 'auto';
//         break;
//       case 'fixed':
//         table.style.width = '600px';
//         break;
//       default:
//         table.style.width = options.tableWidth;
//     }

//     // Ana tablo stili
//     switch (options.style) {
//       case 'simple':
//         table.style.border = 'none';
//         break;
//       case 'bordered':
//         table.style.border = `${options.borderWidth}px solid ${options.borderColor}`;
//         break;
//       case 'modern':
//         table.style.border = 'none';
//         table.style.borderRadius = '8px';
//         table.style.overflow = 'hidden';
//         table.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
//         break;
//       case 'professional':
//         table.style.border = `1px solid ${options.borderColor}`;
//         table.style.borderRadius = '4px';
//         table.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
//         break;
//       case 'minimal':
//         table.style.border = 'none';
//         break;
//       case 'colorful':
//         table.style.border = `2px solid ${options.borderColor}`;
//         table.style.borderRadius = '6px';
//         break;
//     }

//     for (let i = 0; i < rows; i++) {
//       const row = document.createElement('tr');
      
//       // Çizgili satır stili
//       if (options.hasStripes && i % 2 === 1) {
//         row.style.backgroundColor = '#f8f9fa';
//       }
      
//       // Hover efekti ekle
//       row.style.transition = 'background-color 0.2s ease';
//       row.addEventListener('mouseenter', () => {
//         if (!options.hasStripes || i % 2 === 0) {
//           row.style.backgroundColor = '#e9ecef';
//         }
//       });
//       row.addEventListener('mouseleave', () => {
//         if (!options.hasStripes || i % 2 === 0) {
//           row.style.backgroundColor = '';
//         }
//       });
      
//       for (let j = 0; j < cols; j++) {
//         const cell = document.createElement((hasHeaders && i === 0) ? 'th' : 'td');
        
//         // Temel hücre stili
//         cell.style.padding = '12px 16px';
//         cell.style.textAlign = 'left';
//         cell.style.verticalAlign = 'top';
        
//         // Border stili
//         if (options.borderWidth > 0) {
//           cell.style.border = `${options.borderWidth}px solid ${options.borderColor}`;
//         }
        
//         // Başlık hücresi özel stili
//         if (hasHeaders && i === 0) {
//           cell.style.backgroundColor = options.headerBgColor;
//           cell.style.color = options.headerTextColor;
//           cell.style.fontWeight = 'bold';
//           cell.style.textAlign = 'center';
//         }
        
//         // Stil özelleştirmeleri
//         switch (options.style) {
//           case 'simple':
//             if (options.borderWidth === 0) {
//               cell.style.border = 'none';
//               cell.style.borderBottom = '1px solid #eee';
//             }
//             break;
//           case 'modern':
//             if (hasHeaders && i === 0) {
//               cell.style.background = `linear-gradient(135deg, ${options.headerBgColor}, #e9ecef)`;
//             }
//             break;
//           case 'professional':
//             cell.style.fontSize = '14px';
//             if (hasHeaders && i === 0) {
//               cell.style.letterSpacing = '0.5px';
//               cell.style.textTransform = 'uppercase';
//               cell.style.fontSize = '12px';
//             }
//             break;
//           case 'minimal':
//             cell.style.border = 'none';
//             cell.style.borderBottom = '1px solid #f0f0f0';
//             cell.style.padding = '8px 12px';
//             break;
//           case 'colorful':
//             if (hasHeaders && i === 0) {
//               cell.style.background = `linear-gradient(45deg, ${options.headerBgColor}, #007cba)`;
//               cell.style.color = 'white';
//             }
//             break;
//         }
        
//         // Placeholder metin
//         if (hasHeaders && i === 0) {
//           cell.textContent = `Başlık ${j + 1}`;
//         } else {
//           cell.textContent = `Hücre ${i + 1}-${j + 1}`;
//         }
        
//         // Hücreyi düzenlenebilir yap
//         cell.contentEditable = 'true';
//         cell.addEventListener('focus', () => {
//           if (cell.textContent?.startsWith('Başlık') || cell.textContent?.startsWith('Hücre')) {
//             cell.textContent = '';
//           }
//         });
        
//         row.appendChild(cell);
//       }
      
//       table.appendChild(row);
//     }

//     return table;
//   }

//   // Eski fonksiyonu da koruyalım
//   createStyledTable(rows: number, cols: number, hasHeaders: boolean, style: string): HTMLTableElement {
//     const table = document.createElement('table');
//     table.style.borderCollapse = 'collapse';
//     table.style.width = '100%';
//     table.style.margin = '10px 0';
//     table.style.fontFamily = 'inherit';

//     // Stil uygulama
//     switch (style) {
//       case 'simple':
//         table.style.border = 'none';
//         break;
//       case 'bordered':
//         table.style.border = '2px solid #333';
//         break;
//       case 'striped':
//         table.style.border = '1px solid #ddd';
//         break;
//       case 'modern':
//         table.style.border = 'none';
//         table.style.borderRadius = '8px';
//         table.style.overflow = 'hidden';
//         table.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
//         break;
//     }

//     for (let i = 0; i < rows; i++) {
//       const row = document.createElement('tr');
      
//       // Satır stili
//       if (style === 'striped' && i % 2 === 1) {
//         row.style.backgroundColor = '#f9f9f9';
//       }
      
//       for (let j = 0; j < cols; j++) {
//         const cell = document.createElement((hasHeaders && i === 0) ? 'th' : 'td');
        
//         // Hücre stili
//         switch (style) {
//           case 'simple':
//             cell.style.border = 'none';
//             cell.style.borderBottom = '1px solid #eee';
//             break;
//           case 'bordered':
//             cell.style.border = '1px solid #333';
//             break;
//           case 'striped':
//             cell.style.border = '1px solid #ddd';
//             break;
//           case 'modern':
//             cell.style.border = 'none';
//             cell.style.borderBottom = '1px solid #eee';
//             if (hasHeaders && i === 0) {
//               cell.style.backgroundColor = '#f8f9fa';
//               cell.style.fontWeight = 'bold';
//             }
//             break;
//         }

//         cell.style.padding = '12px 8px';
//         cell.style.textAlign = 'left';
//         cell.style.verticalAlign = 'top';

//         if (hasHeaders && i === 0) {
//           cell.innerHTML = `Başlık ${j + 1}`;
//           cell.style.fontWeight = 'bold';
//           if (style !== 'modern') {
//             cell.style.backgroundColor = '#f5f5f5';
//           }
//         } else {
//           cell.innerHTML = '&nbsp;';
//         }
        
//         row.appendChild(cell);
//       }
//       table.appendChild(row);
//     }

//     return table;
//   }

//   // Eksik olan method'ları ekleyelim:
//   insertLink() {
//     console.log('insertLink method called!');
    
//     // Editöre focus et ve selection'ı kaydet
//     this.editor.nativeElement.focus();
    
//     // Selection'ı kaydet
//     const selection = window.getSelection();
//     let savedRange: Range | null = null;
//     let selectedText = '';
    
//     if (selection && selection.rangeCount > 0) {
//       savedRange = selection.getRangeAt(0).cloneRange();
//       selectedText = selection.toString();
//       console.log('Selection kaydedildi:', { selectedText, range: savedRange });
//     }
    
//     setTimeout(() => {
//       const dialog = this.createLinkDialog(selectedText, savedRange);
//       document.body.appendChild(dialog);
//     }, 50);
//   }

//   createLinkDialog(selectedText: string, savedRange?: Range | null): HTMLElement {
//     const overlay = document.createElement('div');
//     overlay.className = 'link-dialog-overlay';
//     overlay.style.cssText = `
//       position: fixed;
//       top: 0;
//       left: 0;
//       width: 100%;
//       height: 100%;
//       background: rgba(0, 0, 0, 0.5);
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       z-index: 10000;
//     `;

//     const dialog = document.createElement('div');
//     dialog.className = 'link-dialog';
//     dialog.style.cssText = `
//       background: white;
//       border-radius: 8px;
//       padding: 20px;
//       min-width: 400px;
//       max-width: 500px;
//       box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
//     `;

//     dialog.innerHTML = `
//       <h3 style="margin: 0 0 20px 0; color: #333;">🔗 Gelişmiş Link Ekle</h3>
      
//       <div style="margin-bottom: 15px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: bold;">URL:</label>
//         <input type="url" id="linkUrl" placeholder="https://example.com" 
//                style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
//         <small style="color: #666; font-size: 12px;">Tam URL girin (http:// veya https:// ile başlayan)</small>
//       </div>
      
//       <div style="margin-bottom: 15px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: bold;">Gösterilecek Metin:</label>
//         <input type="text" id="linkText" placeholder="Link metni" value="${selectedText}"
//                style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
//       </div>

//       <div style="margin-bottom: 15px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: bold;">Link Stili:</label>
//         <select id="linkStyle" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
//           <option value="default">Varsayılan</option>
//           <option value="button">Buton Stili</option>
//           <option value="badge">Badge/Etiket</option>
//           <option value="underlined">Altı Çizgili</option>
//           <option value="bold">Kalın</option>
//           <option value="colored">Renkli</option>
//         </select>
//       </div>

//       <div style="margin-bottom: 15px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: bold;">Link Rengi:</label>
//         <input type="color" id="linkColor" value="#007cba" 
//                style="width: 100%; height: 40px; padding: 4px; border: 1px solid #ddd; border-radius: 4px;">
//       </div>

//       <div style="margin-bottom: 15px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: bold;">Arka Plan Rengi (Buton/Badge için):</label>
//         <input type="color" id="linkBgColor" value="#f8f9fa" 
//                style="width: 100%; height: 40px; padding: 4px; border: 1px solid #ddd; border-radius: 4px;">
//       </div>

//       <div style="margin-bottom: 15px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: bold;">Tooltip (İpucu Metni):</label>
//         <input type="text" id="linkTooltip" placeholder="Link üzerine gelindiğinde gösterilecek metin" 
//                style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
//       </div>
      
//       <div style="margin-bottom: 20px;">
//         <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
//           <input type="checkbox" id="linkNewTab" checked>
//           <span>Yeni sekmede aç</span>
//         </label>
//         <label style="display: flex; align-items: center; gap: 8px;">
//           <input type="checkbox" id="linkNoFollow">
//           <span>SEO: nofollow ekle</span>
//         </label>
//       </div>
      
//       <div style="text-align: right;">
//         <button id="cancelBtn" style="margin-right: 10px; padding: 8px 16px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer;">
//           İptal
//         </button>
//         <button id="insertBtn" style="padding: 8px 16px; border: none; background: #007cba; color: white; border-radius: 4px; cursor: pointer;">
//           Ekle
//         </button>
//       </div>
//     `;

//     overlay.appendChild(dialog);

//     // Event listeners
//     const urlInput = dialog.querySelector('#linkUrl') as HTMLInputElement;
//     const textInput = dialog.querySelector('#linkText') as HTMLInputElement;
//     const styleSelect = dialog.querySelector('#linkStyle') as HTMLSelectElement;
//     const colorInput = dialog.querySelector('#linkColor') as HTMLInputElement;
//     const bgColorInput = dialog.querySelector('#linkBgColor') as HTMLInputElement;
//     const tooltipInput = dialog.querySelector('#linkTooltip') as HTMLInputElement;
//     const newTabCheckbox = dialog.querySelector('#linkNewTab') as HTMLInputElement;
//     const noFollowCheckbox = dialog.querySelector('#linkNoFollow') as HTMLInputElement;
//     const cancelBtn = dialog.querySelector('#cancelBtn') as HTMLButtonElement;
//     const insertBtn = dialog.querySelector('#insertBtn') as HTMLButtonElement;

//     // URL input'una focus
//     setTimeout(() => urlInput.focus(), 100);

//     // URL değiştiğinde otomatik metin doldurma
//     urlInput.addEventListener('input', () => {
//       if (!textInput.value && urlInput.value) {
//         try {
//           const url = new URL(urlInput.value);
//           textInput.value = url.hostname;
//         } catch (e) {
//           // Geçersiz URL, hiçbir şey yapma
//         }
//       }
//     });

//     // Enter tuşu ile ekleme
//     const handleEnter = (e: KeyboardEvent) => {
//       if (e.key === 'Enter') {
//         insertBtn.click();
//       }
//     };
//     urlInput.addEventListener('keypress', handleEnter);
//     textInput.addEventListener('keypress', handleEnter);

//     // İptal butonu
//     cancelBtn.addEventListener('click', () => {
//       overlay.remove();
//     });

//     // Overlay'e tıklayınca kapatma
//     overlay.addEventListener('click', (e) => {
//       if (e.target === overlay) {
//         overlay.remove();
//       }
//     });

//     // ESC tuşu ile kapatma
//     document.addEventListener('keydown', function escHandler(e) {
//       if (e.key === 'Escape') {
//         overlay.remove();
//         document.removeEventListener('keydown', escHandler);
//       }
//     });

//     // Ekle butonu
//     insertBtn.addEventListener('click', () => {
//       console.log('Link ekle butonu tıklandı');
      
//       const url = urlInput.value.trim();
//       const text = textInput.value.trim();
//       const style = styleSelect.value;
//       const color = colorInput.value;
//       const bgColor = bgColorInput.value;
//       const tooltip = tooltipInput.value.trim();
//       const newTab = newTabCheckbox.checked;
//       const noFollow = noFollowCheckbox.checked;
      
//       console.log('Link verileri:', { url, text, style, color, bgColor, tooltip, newTab, noFollow });
      
//       if (!url) {
//         alert('Lütfen geçerli bir URL girin.');
//         return;
//       }

//       if (!text) {
//         alert('Lütfen link metni girin.');
//         return;
//       }

//       // URL doğrulaması
//       try {
//         new URL(url);
//         console.log('URL geçerli');
//       } catch (e) {
//         console.log('URL geçersiz:', e);
//         alert('Geçersiz URL formatı. Lütfen http:// veya https:// ile başlayan geçerli bir URL girin.');
//         return;
//       }

//       const link = document.createElement('a');
//       link.href = url;
//       link.textContent = text;
      
//       console.log('Link elementi oluşturuldu:', link);
      
//       // Temel özellikler
//       if (newTab) {
//         link.target = '_blank';
//         link.rel = noFollow ? 'noopener noreferrer nofollow' : 'noopener noreferrer';
//       } else if (noFollow) {
//         link.rel = 'nofollow';
//       }

//       if (tooltip) {
//         link.title = tooltip;
//       }

//       // Stil uygulama
//       switch (style) {
//         case 'default':
//           link.style.color = color;
//           link.style.textDecoration = 'underline';
//           break;
//         case 'button':
//           link.style.color = color;
//           link.style.backgroundColor = bgColor;
//           link.style.padding = '8px 16px';
//           link.style.border = 'none';
//           link.style.borderRadius = '4px';
//           link.style.textDecoration = 'none';
//           link.style.display = 'inline-block';
//           link.style.cursor = 'pointer';
//           link.style.transition = 'all 0.2s ease';
//           link.style.fontWeight = 'bold';
//           // Hover efekti için CSS ekle
//           link.addEventListener('mouseenter', () => {
//             link.style.opacity = '0.8';
//             link.style.transform = 'translateY(-1px)';
//           });
//           link.addEventListener('mouseleave', () => {
//             link.style.opacity = '1';
//             link.style.transform = 'translateY(0)';
//           });
//           break;
//         case 'badge':
//           link.style.color = color;
//           link.style.backgroundColor = bgColor;
//           link.style.padding = '4px 8px';
//           link.style.borderRadius = '12px';
//           link.style.textDecoration = 'none';
//           link.style.fontSize = '12px';
//           link.style.fontWeight = 'bold';
//           link.style.display = 'inline-block';
//           link.style.border = `1px solid ${color}`;
//           break;
//         case 'underlined':
//           link.style.color = color;
//           link.style.textDecoration = 'underline';
//           link.style.textUnderlineOffset = '3px';
//           link.style.textDecorationThickness = '2px';
//           break;
//         case 'bold':
//           link.style.color = color;
//           link.style.fontWeight = 'bold';
//           link.style.textDecoration = 'none';
//           break;
//         case 'colored':
//           link.style.color = color;
//           link.style.backgroundColor = bgColor;
//           link.style.padding = '2px 6px';
//           link.style.borderRadius = '3px';
//           link.style.textDecoration = 'none';
//           break;
//       }

//       // Kaydedilmiş range'i kullan veya yeni selection al
//       let targetRange: Range | null = null;
      
//       if (savedRange) {
//         console.log('Kaydedilmiş range kullanılıyor');
//         targetRange = savedRange;
        
//         // Range'i restore et
//         const selection = window.getSelection();
//         if (selection) {
//           selection.removeAllRanges();
//           selection.addRange(targetRange);
//         }
//       } else {
//         console.log('Yeni selection alınıyor');
//         const selection = window.getSelection();
//         if (selection && selection.rangeCount > 0) {
//           targetRange = selection.getRangeAt(0);
//         }
//       }
      
//       console.log('Target range:', targetRange);
      
//       if (targetRange) {
//         console.log('Range bulundu, link ekleniyor...');
        
//         if (selectedText && !targetRange.collapsed) {
//           // Seçili metin varsa onu link yap
//           targetRange.deleteContents();
//           console.log('Seçili metin silindi');
//         }
        
//         targetRange.insertNode(link);
//         targetRange.setStartAfter(link);
//         targetRange.collapse(true);
        
//         const selection = window.getSelection();
//         if (selection) {
//           selection.removeAllRanges();
//           selection.addRange(targetRange);
//         }
//         console.log('Link range ile eklendi');
//       } else {
//         // Range yoksa editörün sonuna ekle
//         console.log('Range yok, editörün sonuna ekleniyor');
//         this.editor.nativeElement.appendChild(link);
//       }

//       console.log('Link ekleme işlemi tamamlandı');
//       this.onContentChange();
//       overlay.remove();
//     });

//     return overlay;
//   }

//   insertImage() {
//     console.log('insertImage method called!');
    
//     // Editöre focus et ve selection'ı kaydet
//     this.editor.nativeElement.focus();
    
//     // Biraz bekle ki focus tam olsun
//     setTimeout(() => {
//       alert('insertImage method is working!');
//       // Gelişmiş resim ekleme dialog'u
//       const dialog = this.createImageDialog();
//       document.body.appendChild(dialog);
//     }, 50);
//   }

//   createImageDialog(): HTMLElement {
//     const overlay = document.createElement('div');
//     overlay.className = 'image-dialog-overlay';
//     overlay.style.cssText = `
//       position: fixed;
//       top: 0;
//       left: 0;
//       width: 100%;
//       height: 100%;
//       background: rgba(0, 0, 0, 0.5);
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       z-index: 10000;
//     `;

//     const dialog = document.createElement('div');
//     dialog.className = 'image-dialog';
//     dialog.style.cssText = `
//       background: white;
//       border-radius: 8px;
//       padding: 20px;
//       min-width: 400px;
//       max-width: 500px;
//       box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
//     `;

//     dialog.innerHTML = `
//       <h3 style="margin: 0 0 20px 0; color: #333;">🖼️ Resim Ekle</h3>
      
//       <div style="margin-bottom: 15px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: bold;">Resim URL'si:</label>
//         <input type="url" id="imageUrl" placeholder="https://example.com/image.jpg" 
//                style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
//       </div>
      
//       <div style="margin-bottom: 15px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: bold;">Alt Metni:</label>
//         <input type="text" id="imageAlt" placeholder="Resim açıklaması" 
//                style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
//       </div>
      
//       <div style="margin-bottom: 20px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: bold;">Boyut:</label>
//         <select id="imageSize" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
//           <option value="auto">Orijinal Boyut</option>
//           <option value="small">Küçük (300px)</option>
//           <option value="medium">Orta (500px)</option>
//           <option value="large">Büyük (800px)</option>
//           <option value="full">Tam Genişlik</option>
//         </select>
//       </div>
      
//       <div style="margin-bottom: 20px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: bold;">Hizalama:</label>
//         <select id="imageAlign" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
//           <option value="none">Yok</option>
//           <option value="left">Sola</option>
//           <option value="center">Ortala</option>
//           <option value="right">Sağa</option>
//         </select>
//       </div>
      
//       <div style="text-align: right;">
//         <button id="cancelBtn" style="margin-right: 10px; padding: 8px 16px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer;">
//           İptal
//         </button>
//         <button id="insertBtn" style="padding: 8px 16px; border: none; background: #007cba; color: white; border-radius: 4px; cursor: pointer;">
//           Ekle
//         </button>
//       </div>
//     `;

//     overlay.appendChild(dialog);

//     // Event listeners
//     const urlInput = dialog.querySelector('#imageUrl') as HTMLInputElement;
//     const altInput = dialog.querySelector('#imageAlt') as HTMLInputElement;
//     const sizeSelect = dialog.querySelector('#imageSize') as HTMLSelectElement;
//     const alignSelect = dialog.querySelector('#imageAlign') as HTMLSelectElement;
//     const cancelBtn = dialog.querySelector('#cancelBtn') as HTMLButtonElement;
//     const insertBtn = dialog.querySelector('#insertBtn') as HTMLButtonElement;

//     // URL input'una focus
//     setTimeout(() => urlInput.focus(), 100);

//     // Enter tuşu ile ekleme
//     urlInput.addEventListener('keypress', (e) => {
//       if (e.key === 'Enter') {
//         insertBtn.click();
//       }
//     });

//     // İptal butonu
//     cancelBtn.addEventListener('click', () => {
//       overlay.remove();
//     });

//     // Overlay'e tıklayınca kapatma
//     overlay.addEventListener('click', (e) => {
//       if (e.target === overlay) {
//         overlay.remove();
//       }
//     });

//     // ESC tuşu ile kapatma
//     document.addEventListener('keydown', function escHandler(e) {
//       if (e.key === 'Escape') {
//         overlay.remove();
//         document.removeEventListener('keydown', escHandler);
//       }
//     });

//     // Ekle butonu
//     insertBtn.addEventListener('click', () => {
//       const url = urlInput.value.trim();
//       if (!url) {
//         alert('Lütfen geçerli bir URL girin.');
//         return;
//       }

//       const img = document.createElement('img');
//       img.src = url;
//       img.alt = altInput.value || 'Yüklenen resim';
      
//       // Boyut ayarları
//       switch (sizeSelect.value) {
//         case 'small':
//           img.style.maxWidth = '300px';
//           break;
//         case 'medium':
//           img.style.maxWidth = '500px';
//           break;
//         case 'large':
//           img.style.maxWidth = '800px';
//           break;
//         case 'full':
//           img.style.width = '100%';
//           break;
//         default:
//           img.style.maxWidth = '100%';
//       }

//       img.style.height = 'auto';
//       img.style.display = 'block';
//       img.style.margin = '10px 0';

//       // Hizalama ayarları
//       switch (alignSelect.value) {
//         case 'left':
//           img.style.float = 'left';
//           img.style.marginRight = '15px';
//           break;
//         case 'right':
//           img.style.float = 'right';
//           img.style.marginLeft = '15px';
//           break;
//         case 'center':
//           img.style.margin = '10px auto';
//           img.style.display = 'block';
//           break;
//       }

//       // Resim yükleme kontrolü
//       img.onload = () => {
//         console.log(`Resim başarıyla yüklendi: ${img.naturalWidth}x${img.naturalHeight}`);
//       };

//       img.onerror = () => {
//         alert('Resim yüklenemedi. URL\'yi kontrol edin.');
//         img.remove();
//       };

//       this.insertElement(img);
//       overlay.remove();
//     });

//     return overlay;
//   }

//   insertBlockquote() {
//     const selection = window.getSelection();
//     if (selection && selection.rangeCount > 0) {
//       const range = selection.getRangeAt(0);
//       let selectedContent = '';
      
//       if (!range.collapsed) {
//         // Seçili metin varsa
//         selectedContent = range.toString();
//       }
      
//       const blockquote = document.createElement('blockquote');
//       blockquote.style.margin = '16px 0';
//       blockquote.style.padding = '12px 16px';
//       blockquote.style.borderLeft = '4px solid #007cba';
//       blockquote.style.background = '#f8f9fa';
//       blockquote.style.fontStyle = 'italic';
//       blockquote.style.color = '#555';
//       blockquote.style.borderRadius = '0 4px 4px 0';
      
//       if (selectedContent) {
//         blockquote.textContent = selectedContent;
//         range.deleteContents();
//       } else {
//         blockquote.innerHTML = 'Buraya alıntı metninizi yazın...';
//       }
      
//       range.insertNode(blockquote);
      
//       // Cursor'ı blockquote'un sonuna taşı
//       range.setStartAfter(blockquote);
//       range.collapse(true);
//       selection.removeAllRanges();
//       selection.addRange(range);
      
//       this.onContentChange();
//       this.editor.nativeElement.focus();
//     }
//   }

//   insertCode() {
//     const selection = window.getSelection();
//     if (selection && selection.rangeCount > 0) {
//       const range = selection.getRangeAt(0);
//       let selectedText = '';
      
//       if (!range.collapsed) {
//         selectedText = range.toString();
//       }
      
//       const code = document.createElement('code');
//       code.style.background = '#f4f4f4';
//       code.style.padding = '2px 6px';
//       code.style.borderRadius = '3px';
//       code.style.fontFamily = "'Courier New', monospace";
//       code.style.fontSize = '13px';
//       code.style.color = '#d63384';
//       code.style.border = '1px solid #e9ecef';
      
//       if (selectedText) {
//         code.textContent = selectedText;
//         range.deleteContents();
//       } else {
//         code.textContent = 'kod';
//       }
      
//       range.insertNode(code);
      
//       // Cursor'ı code element'in sonuna taşı
//       range.setStartAfter(code);
//       range.collapse(true);
//       selection.removeAllRanges();
//       selection.addRange(range);
      
//       this.onContentChange();
//       this.editor.nativeElement.focus();
//     }
//   }

//   insertHorizontalRule() {
//     const hr = document.createElement('hr');
//     hr.style.border = 'none';
//     hr.style.borderTop = '1px solid #ddd';
//     hr.style.margin = '20px 0';
//     hr.style.height = '1px';
    
//     this.insertElement(hr);
//   }

//   clearFormatting() {
//     const selection = window.getSelection();
//     if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
//       // Seçili metin varsa sadece onun formatını temizle
//       document.execCommand('removeFormat', false);
//     } else {
//       // Seçili metin yoksa cursor'ın bulunduğu elementi temizle
//       const range = selection?.getRangeAt(0);
//       if (range) {
//         let container = range.commonAncestorContainer;
//         if (container.nodeType === Node.TEXT_NODE) {
//           container = container.parentElement!;
//         }
        
//         // Parent element'in stillerini temizle
//         if (container && container !== this.editor.nativeElement) {
//           const element = container as HTMLElement;
//           element.removeAttribute('style');
//           element.removeAttribute('class');
//         }
//       }
//     }
    
//     this.onContentChange();
//     this.editor.nativeElement.focus();
//   }

//   insertElement(element: HTMLElement) {
//     console.log('insertElement called with:', element);
    
//     const selection = window.getSelection();
//     console.log('Current selection:', selection);
    
//     if (selection && selection.rangeCount > 0) {
//       const range = selection.getRangeAt(0);
//       console.log('Current range:', range);
//       console.log('Range container:', range.commonAncestorContainer);
      
//       // Eğer range editör dışındaysa, editörün sonuna ekle
//       const editorElement = this.editor.nativeElement;
//       if (!editorElement.contains(range.commonAncestorContainer)) {
//         console.log('Range is outside editor, appending to editor end');
//         editorElement.appendChild(element);
//       } else {
//         range.insertNode(element);
//         range.collapse(false);
//         selection.removeAllRanges();
//         selection.addRange(range);
//       }
//     } else {
//       console.log('No selection found, appending to editor end');
//       // Selection yoksa editörün sonuna ekle
//       this.editor.nativeElement.appendChild(element);
//     }
    
//     this.onContentChange();
//     this.editor.nativeElement.focus();
//   }

//   handleFileDrop(e: DragEvent) {
//     this.editor.nativeElement.classList.remove('dragover');
    
//     const files = e.dataTransfer?.files;
//     if (files && files.length > 0) {
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         if (file.type.startsWith('image/')) {
//           this.insertImageFile(file);
//         } else if (file.type === 'text/plain') {
//           this.insertTextFile(file);
//         } else {
//           alert(`Desteklenmeyen dosya türü: ${file.type}`);
//         }
//       }
//     }
//   }

//   insertImageFile(file: File) {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const img = document.createElement('img');
//       img.src = e.target?.result as string;
//       img.style.maxWidth = '100%';
//       img.style.height = 'auto';
//       img.style.display = 'block';
//       img.style.margin = '10px 0';
//       img.alt = file.name;
      
//       this.insertElement(img);
//     };
//     reader.readAsDataURL(file);
//   }

//   insertTextFile(file: File) {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const text = e.target?.result as string;
//       this.insertFormattedText(text);
//     };
//     reader.readAsText(file);
//   }

//   updateSelection() {
//     const selection = window.getSelection();
//     if (selection && selection.rangeCount > 0) {
//       this.selectedText = selection.toString();
//     }
//   }

//   onContentChange() {
//     const content = this.editor.nativeElement.innerHTML;
//     this.content = content; // HTML çıktı paneli için güncel içerik
//     this.contentChange.emit(content);
//     this.updateWordCount();
//   }

//   updateContent() {
//     if (this.editor) {
//       this.editor.nativeElement.innerHTML = this.content;
//       this.updateWordCount();
//     }
//   }

//   updateWordCount() {
//     const text = this.editor.nativeElement.textContent || '';
//     this.charCount = text.length;
//     this.wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
//     this.paragraphCount = (this.editor.nativeElement.innerHTML.match(/<p[^>]*>/gi) || []).length;
//   }

//   undo() {
//     document.execCommand('undo', false);
//     this.onContentChange();
//     this.editor.nativeElement.focus();
//   }

//   redo() {
//     document.execCommand('redo', false);
//     this.onContentChange();
//     this.editor.nativeElement.focus();
//   }

//   autoSave() {
//     const data = {
//       content: this.editor.nativeElement.innerHTML,
//       timestamp: new Date().toISOString()
//     };
//     localStorage.setItem('editorAutoSave', JSON.stringify(data));
    
//     // Kullanıcıya bildiri göster
//     this.showNotification('İçerik otomatik kaydedildi! 💾');
//   }

//   showNotification(message: string) {
//     // Basit bildiri sistemi
//     const notification = document.createElement('div');
//     notification.textContent = message;
//     notification.style.cssText = `
//       position: fixed;
//       top: 20px;
//       right: 20px;
//       background: #4CAF50;
//       color: white;
//       padding: 10px 20px;
//       border-radius: 4px;
//       z-index: 1000;
//       box-shadow: 0 2px 10px rgba(0,0,0,0.2);
//     `;
    
//     document.body.appendChild(notification);
    
//     setTimeout(() => {
//       if (document.body.contains(notification)) {
//         document.body.removeChild(notification);
//       }
//     }, 3000);
//   }

//   exportToWord() {
//     const content = this.editor.nativeElement.innerHTML;
//     const wordDoc = `
//       <html xmlns:o='urn:schemas-microsoft-com:office:office' 
//             xmlns:w='urn:schemas-microsoft-com:office:word' 
//             xmlns='http://www.w3.org/TR/REC-html40'>
//       <head>
//         <meta charset='utf-8'>
//         <title>Export HTML to Word Document</title>
//         <!--[if gte mso 9]>
//         <xml>
//           <w:WordDocument>
//             <w:View>Print</w:View>
//             <w:Zoom>90</w:Zoom>
//             <w:DoNotPromptForConvert/>
//             <w:DoNotDisplayGridlines/>
//           </w:WordDocument>
//         </xml>
//         <![endif]-->
//         <style>
//           @page { margin: 1in; }
//           body { font-family: Calibri, sans-serif; font-size: 12pt; line-height: 1.08; }
//         </style>
//       </head>
//       <body>${content}</body>
//       </html>
//     `;
    
//     const blob = new Blob([wordDoc], { type: 'application/msword' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'document.doc';
//     a.click();
//     URL.revokeObjectURL(url);
//   }

//   onEditorFocus() {
//     this.isEditorActive = true;
//   }

//   onEditorBlur() {
//     this.isEditorActive = false;
//   }

//   togglePreview() {
//     this.isPreviewMode = !this.isPreviewMode;
//     if (this.isPreviewMode) {
//       // Preview moduna geçerken içeriği güncelle
//       this.content = this.editor.nativeElement.innerHTML;
//     }
//   }

//   // Word formatını temizleme fonksiyonları
//   cleanWordFormatting() {
//     const content = this.editor.nativeElement.innerHTML;
//     const cleanedContent = this.removeWordFormatting(content);
//     this.editor.nativeElement.innerHTML = cleanedContent;
//     this.onContentChange();
//   }

//   removeWordFormatting(html: string): string {
//     let cleaned = html;

//     // Tüm inline background stillerini kaldır
//     cleaned = cleaned.replace(/background-color:\s*[^;]+;?/gi, '');
//     cleaned = cleaned.replace(/background:\s*[^;]+;?/gi, '');
    
//     // Word özel class'larını kaldır
//     cleaned = cleaned.replace(/class="[^"]*Mso[^"]*"/gi, '');
//     cleaned = cleaned.replace(/class="[^"]*Word[^"]*"/gi, '');
    
//     // Boş style attribute'larını temizle
//     cleaned = cleaned.replace(/style="\s*"/gi, '');
//     cleaned = cleaned.replace(/style=''\s*/gi, '');
    
//     // Word conditional comments
//     cleaned = cleaned.replace(/<!--\[if[^>]*>.*?<!\[endif\]-->/gs, '');
    
//     // Word XML namespace'leri
//     cleaned = cleaned.replace(/xmlns:\w+="[^"]*"/g, '');
    
//     // Word özel tag'ler
//     cleaned = cleaned.replace(/<\/?[ovwm]:\w+[^>]*>/gi, '');
    
//     // Font tag'leri span'a çevir
//     cleaned = this.convertFontTagsToSpan(cleaned);
    
//     // Gereksiz span'ları temizle
//     cleaned = this.cleanRedundantSpans(cleaned);

//     return cleaned;
//   }

//   convertFontTagsToSpan(html: string): string {
//     return html.replace(/<font([^>]*)>(.*?)<\/font>/gi, (match, attrs, content) => {
//       let styles = [];
      
//       const faceMatch = attrs.match(/face="([^"]*)"/i);
//       if (faceMatch) styles.push(`font-family: ${faceMatch[1]}`);
      
//       const sizeMatch = attrs.match(/size="([^"]*)"/i);
//       if (sizeMatch) styles.push(`font-size: ${this.convertWordFontSize(parseInt(sizeMatch[1]))}`);
      
//       const colorMatch = attrs.match(/color="([^"]*)"/i);
//       if (colorMatch) styles.push(`color: ${colorMatch[1]}`);
      
//       const styleAttr = styles.length > 0 ? ` style="${styles.join('; ')}"` : '';
//       return `<span${styleAttr}>${content}</span>`;
//     });
//   }

//   cleanRedundantSpans(html: string): string {
//     // Boş span'ları kaldır
//     html = html.replace(/<span[^>]*>\s*<\/span>/gi, '');
    
//     // İç içe aynı stil span'ları birleştir
//     html = html.replace(/<span([^>]*)><span[^>]*>(.*?)<\/span><\/span>/gi, '<span$1>$2</span>');
    
//     return html;
//   }

//   // Kullanıcının çağırabileceği hızlı temizleme fonksiyonu
//   quickCleanFormatting() {
//     if (confirm('Tüm Word formatlaması temizlensin mi? Bu işlem geri alınamaz.')) {
//       this.cleanWordFormatting();
//       alert('Word formatlaması temizlendi!');
//     }
//   }

//   // Sadece background'ları temizle
//   removeBackgrounds() {
//     const content = this.editor.nativeElement.innerHTML;
//     let cleaned = content;
    
//     // Tüm background stillerini kaldır
//     cleaned = cleaned.replace(/background-color:\s*[^;]+;?/gi, '');
//     cleaned = cleaned.replace(/background:\s*[^;]+;?/gi, '');
//     cleaned = cleaned.replace(/style="\s*"/gi, '');
    
//     this.editor.nativeElement.innerHTML = cleaned;
//     this.onContentChange();
//   }

//   // =========== HTML ÇIKTI FONKSİYONLARI =========== //
  
//   // HTML çıktı panelini aç/kapat
//   toggleOutput() {
//     this.showOutput = !this.showOutput;
//   }

//   // HTML çıktısını formatlanmış şekilde al
//   getFormattedHtml(): string {
//     const content = this.editor.nativeElement.innerHTML;
//     return this.formatHtmlOutput(content);
//   }

//   // HTML'i güzel formatla
//   formatHtmlOutput(html: string): string {
//     let formatted = html;
    
//     // Boş satırları temizle
//     formatted = formatted.replace(/^\s*\n/gm, '');
    
//     // Tag'leri yeni satırlara böl
//     formatted = formatted.replace(/></g, '>\n<');
    
//     // Girintileme ekle
//     const lines = formatted.split('\n');
//     let indentLevel = 0;
//     const indentedLines = lines.map(line => {
//       const trimmed = line.trim();
//       if (!trimmed) return '';
      
//       // Kapanış tag'i için girintiyi azalt
//       if (trimmed.startsWith('</')) {
//         indentLevel = Math.max(0, indentLevel - 1);
//       }
      
//       const indented = '  '.repeat(indentLevel) + trimmed;
      
//       // Açılış tag'i için girintiyi artır (self-closing değilse)
//       if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
//         indentLevel++;
//       }
      
//       return indented;
//     });
    
//     return indentedLines.join('\n');
//   }

//   // HTML çıktısını kopyala
//   async copyHtmlOutput() {
//     const htmlContent = this.getFormattedHtml();
//     try {
//       await navigator.clipboard.writeText(htmlContent);
//       alert('HTML içeriği panoya kopyalandı!');
//     } catch (err) {
//       console.error('Kopyalama hatası:', err);
//       // Fallback method
//       const textArea = document.createElement('textarea');
//       textArea.value = htmlContent;
//       document.body.appendChild(textArea);
//       textArea.select();
//       document.execCommand('copy');
//       document.body.removeChild(textArea);
//       alert('HTML içeriği panoya kopyalandı!');
//     }
//   }

//   // HTML dosyası olarak indir
//   downloadHtml() {
//     const htmlContent = this.getFormattedHtml();
//     const completeHtml = `<!DOCTYPE html>
// <html lang="tr">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Rich Editor İçeriği</title>
//     <style>
//         body {
//             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//             line-height: 1.6;
//             max-width: 800px;
//             margin: 0 auto;
//             padding: 20px;
//             color: #333;
//         }
//         img {
//             max-width: 100%;
//             height: auto;
//         }
//         table {
//             border-collapse: collapse;
//             width: 100%;
//             margin: 10px 0;
//         }
//         td, th {
//             border: 1px solid #ddd;
//             padding: 8px 12px;
//         }
//         th {
//             background-color: #f5f5f5;
//             font-weight: bold;
//         }
//         blockquote {
//             border-left: 4px solid #007cba;
//             margin: 16px 0;
//             padding: 12px 16px;
//             background: #f8f9fa;
//             font-style: italic;
//         }
//         code {
//             background: #f4f4f4;
//             padding: 2px 4px;
//             border-radius: 3px;
//             font-family: 'Courier New', monospace;
//         }
//         pre {
//             background: #f4f4f4;
//             padding: 12px;
//             border-radius: 4px;
//             overflow-x: auto;
//         }
//     </style>
// </head>
// <body>
// ${htmlContent}
// </body>
// </html>`;

//     const blob = new Blob([completeHtml], { type: 'text/html; charset=utf-8' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'rich-editor-content.html';
//     a.click();
//     URL.revokeObjectURL(url);
//   }

//   // Raw HTML çıktısını al (temizlenmemiş)
//   getRawHtml(): string {
//     return this.editor.nativeElement.innerHTML;
//   }

//   // Sadece text içeriği al (HTML tag'ler olmadan)
//   getTextContent(): string {
//     return this.editor.nativeElement.textContent || '';
//   }

//   // HTML çıktısının istatistiklerini al
//   getOutputStats() {
//     const html = this.getRawHtml();
//     const text = this.getTextContent();
    
//     return {
//       htmlLength: html.length,
//       textLength: text.length,
//       tagCount: (html.match(/<[^>]+>/g) || []).length,
//       wordCount: this.wordCount,
//       charCount: this.charCount,
//       paragraphCount: this.paragraphCount
//     };
//   }
// }