# NLabs Text Editor

Angular 18 tabanlı modern ve kullanıcı dostu rich text editor kütüphanesi. Bu proje, web uygulamalarında gelişmiş metin düzenleme özellikleri sunmak için tasarlanmıştır.

## 🚀 Özellikler

- ✅ **Rich Text Editing**: Zengin metin düzenleme özellikleri
- ✅ **Heading Levels**: H1-H6 arası başlık seviyeleri
- ✅ **Text Formatting**: Kalın, italik, altı çizili metin biçimlendirme
- ✅ **Text Alignment**: Sol, orta, sağ ve iki yana yaslama
- ✅ **Lists**: Sıralı ve sırasız liste desteği
- ✅ **Links**: Bağlantı ekleme ve düzenleme
- ✅ **Font Customization**: Font ailesi ve boyut seçimi
- ✅ **Color Support**: Metin ve arka plan rengi
- ✅ **Word Content**: Word belgelerinden kopyala-yapıştır
- ✅ **Clean HTML**: Temiz HTML çıktısı
- ✅ **Responsive Design**: Mobil uyumlu tasarım
- ✅ **Tooltips**: Tüm butonlarda açıklayıcı ipuçları

## 📦 Kurulum

```bash
npm install nlabs-text-editor
```

## 🛠️ Kullanım

Angular projenizde modül olarak import edin:

```typescript
import { NlabsTextEditorComponent } from 'nlabs-text-editor';

@Component({
  standalone: true,
  imports: [NlabsTextEditorComponent],
  // ...
})
```

Template'de kullanın:

```html
<nlabs-text-editor 
  [(ngModel)]="content"
  [placeholder]="'Metin yazın...'"
  [height]="'400px'">
</nlabs-text-editor>
```

## 🧪 Geliştirme

Yerel geliştirme sunucusunu başlatmak için:

```bash
ng serve
```

Sunucu çalıştıktan sonra, tarayıcınızda `http://localhost:4200/` adresine gidin.

## 🏗️ Proje Yapısı

```
projects/
├── nlabs-text-editor/          # Ana kütüphane
│   ├── src/
│   │   ├── lib/
│   │   │   └── nlabs-text-editor/
│   │   │       ├── nlabs-text-editor.ts      # Ana component
│   │   │       ├── nlabs-text-editor.html    # Template
│   │   │       └── nlabs-text-editor.css     # Stil dosyası
│   │   └── public-api.ts       # Public API export
└── nlabs-text-editor-app/      # Demo uygulaması
    └── src/
        └── app/               # Test uygulaması
```

## 🔧 Build

Kütüphaneyi build etmek için:

```bash
ng build nlabs-text-editor
```

Build artifacts `dist/` klasöründe saklanır.

## 🧪 Test

Unit testleri çalıştırmak için:

```bash
ng test
```

## 📖 API Referansı

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `ngModel` | `string` | `''` | Editor içeriği (two-way binding) |
| `placeholder` | `string` | `'Write something...'` | Placeholder metni |
| `height` | `string` | `'300px'` | Editor yüksekliği |
| `disabled` | `boolean` | `false` | Editor devre dışı durumu |

### Output Events

| Event | Type | Description |
|-------|------|-------------|
| `ngModelChange` | `string` | İçerik değiştiğinde emit edilir |

## 🤝 Katkıda Bulunma

1. Bu projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'ınızı push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- GitHub: [NlabsNpmPackages](https://github.com/NlabsNpmPackages)
- Repository: [nlabs-text-editor](https://github.com/NlabsNpmPackages/nlabs-text-editor)

## 🔗 Bağlantılar

- [Angular CLI Dökümantasyonu](https://angular.dev/tools/cli)
- [Angular Standalone Components](https://angular.dev/guide/components/importing)
- [NPM Package](https://www.npmjs.com/package/nlabs-text-editor)
