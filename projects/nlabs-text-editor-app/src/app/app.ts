import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {TextEditor } from '../../../nlabs-text-editor/src//public-api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, TextEditor],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'Gelişmiş Metin Editörü';
  editorContent = '';
  darkMode = false;
  showPreview = false;
  lastUpdate = new Date();

  onContentChange(content: string) {
    this.editorContent = content;
    this.lastUpdate = new Date();
  }

  togglePreview() {
    this.showPreview = !this.showPreview;
  }

  clearAll() {
    if (confirm('Tüm içeriği silmek istediğinizden emin misiniz?')) {
      this.editorContent = '';
      this.lastUpdate = new Date();
    }
  }

  saveToLocal() {
    const data = {
      content: this.editorContent,
      darkMode: this.darkMode,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('editorData', JSON.stringify(data));
    alert('İçerik başarıyla kaydedildi! 💾');
  }

  loadFromLocal() {
    const saved = localStorage.getItem('editorData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.editorContent = data.content || '';
        this.darkMode = data.darkMode || false;
        this.lastUpdate = new Date();
        alert('İçerik başarıyla yüklendi! 📂');
      } catch (error) {
        alert('Kaydedilmiş veri bozuk! ❌');
      }
    } else {
      alert('Kaydedilmiş veri bulunamadı! ℹ️');
    }
  }
}
